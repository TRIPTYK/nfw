
import * as Boom from "@hapi/boom";
import * as HttpStatus from "http-status";
import {User} from "../models/user.model";
import {RefreshToken} from "../models/refresh-token.model";
import {Request, Response} from "express";
import {getCustomRepository, getRepository} from "typeorm";
import {UserRepository} from "../repositories/user.repository";
import {BaseController} from "./base.controller";
import {Roles} from "../enums/role.enum";
import {RefreshTokenRepository} from "../repositories/refresh-token.repository";
import { Controller } from "@triptyk/nfw-core";
import Refresh from "passport-oauth2-refresh";
import { RefreshTokenSerializer } from "../serializers/refresh-token.serializer";
import { container } from "tsyringe";
import EnvironmentConfiguration from "../../config/environment.config";
import { Environments } from "../enums/environments.enum";

/**
 * Authentification Controller!
 * @module controllers/auth.controller.ts
 */
@Controller({
    repository : UserRepository
})
class AuthController extends BaseController {
    protected refreshRepository;

    constructor() {
        super();
        this.refreshRepository = getCustomRepository(RefreshTokenRepository);
    }

    /**
     * Create and save a new user
     *
     * @param {Object} req
     * @param {Object}res
     * @param {Function}next
     *
     * @return JWT|next
     *
     * @public
     */
    protected async register(req: Request, res: Response, next) {
        let user: User = this.repository.create(req.body);

        const {config : {env}} = EnvironmentConfiguration; // load env

        user.role = [Environments.Test, Environments.Development].includes(env) ? Roles.Admin : Roles.User;
        user = await this.repository.save(user);
        const token = await this.refreshRepository.generateTokenResponse(user, user.token(), req.ip);
        res.status(HttpStatus.CREATED);

        return new RefreshTokenSerializer().serialize(token);
    }

    /**
     * Login with an existing user or creates a new one if valid accessToken token
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     *
     * @return JWT|next
     *
     * @public
     */
    protected async login(req: Request, res: Response) {
        const { force } = req.query;
        const { email , password } = req.body;

        const {config : {jwt : {authMode}}} = EnvironmentConfiguration; // load env

        const {user, accessToken} = await this.repository.findAndGenerateToken({
            email,
            ip : req.ip,
            password
        }, authMode === "normal", force);

        const token: RefreshToken = await this.refreshRepository.generateTokenResponse(user, accessToken, req.ip);

        return new RefreshTokenSerializer().serialize(token);
    }

    /**
     *
     *
     * @protected
     * @param {Request} req
     * @param {Response} res
     * @param {Function} next
     * @memberof AuthController
     */
    protected async refreshOAuth(req: Request, res: Response, next: Function) {
        const user: User = req["user"] as User;
        const{ service } = req.params;

        const {refreshToken, accessToken} = await new Promise((resolve, rej) => {
            Refresh.requestNewAccessToken(service, user.services[service].refreshToken,
                // tslint:disable-next-line: no-shadowed-variable
                (err, accessToken, refreshToken) => {
                    if (err) { rej(err); }
                    resolve({
                        accessToken,
                        refreshToken
                    });
                }
            );
        });

        user.services[service].accessToken = accessToken;
        user.services[service].refreshToken = refreshToken;

        await this.repository.save(user);

        res.sendStatus(HttpStatus.OK);
    }

    /**
     * Login with an existing user or creates a new one if valid accessToken token
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     *
     * @return JWT|next
     *
     * @public
     */
    protected async oAuth(req: Request, res: Response, next) {
        const user: User = req["user"] as User;
        const accessToken = user.token();
        const token = await this.refreshRepository.generateTokenResponse(user, accessToken, req.ip);
        token.user = user;

        return new RefreshTokenSerializer().serialize(token);
    }

    /**
     * Refresh JWT token by RefreshToken removing, and re-creating
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     *
     * @return JWT|next
     *
     * @public
     */
    protected async refresh(req: Request, res: Response, next) {
        const refreshTokenRepository = getRepository(RefreshToken);

        const {token} = req.body;

        const refreshObject = await refreshTokenRepository.findOne({
            where: {refreshToken: token}
        });

        if (!refreshObject) {
            return next(Boom.expectationFailed("RefreshObject cannot be empty"));
        }

        await refreshTokenRepository.remove(refreshObject);
        // Get owner user of the token
        const { user, accessToken } = await this.repository.findAndGenerateToken({
            email: refreshObject.user.email,
            ip : req.ip,
            refreshObject
        }, true);
        const refreshedToken = await this.refreshRepository.generateTokenResponse(user, accessToken , req.ip);

        return new RefreshTokenSerializer().serialize(refreshedToken);
    }
}

export {AuthController};
