
import * as HttpStatus from "http-status";
import {User} from "../models/user.model";
import {RefreshToken} from "../models/refresh-token.model";
import {Request, Response} from "express";
import {getCustomRepository, getRepository} from "typeorm";
import {UserRepository} from "../repositories/user.repository";
import BaseController from "./base.controller";
import {Roles} from "../enums/role.enum";
import {RefreshTokenRepository} from "../repositories/refresh-token.repository";
import Refresh from "passport-oauth2-refresh";
import { AuthTokenSerializer } from "../serializers/auth-token.serializer";
import EnvironmentConfiguration from "../../config/environment.config";
import { Environments } from "../enums/environments.enum";
import * as Boom from "@hapi/boom";
import { OAuthToken } from "../models/oauth-token.model";

/**
 * Authentification Controller!
 * @module controllers/auth.controller.ts
 */
class AuthController extends BaseController<User> {
    protected repository: UserRepository;
    private refreshRepository: RefreshTokenRepository;

    constructor() {
        super(UserRepository);
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
    public async register(req: Request, res: Response, next) {
        let user = this.repository.create(req.body as object);

        const {config : {env}} = EnvironmentConfiguration; // load env

        user.role = [Environments.Test, Environments.Development].includes(env) ? Roles.Admin : Roles.User;
        user = await this.repository.save(user);
        const accessToken = user.generateAccessToken();
        const refreshToken = await this.refreshRepository.generateNewRefreshToken(user);
        res.status(HttpStatus.CREATED);

        return new AuthTokenSerializer().serialize(accessToken, refreshToken.refreshToken, user);
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
    public async login(req: Request, res: Response) {
        const { email , password } = req.body;
        const { user, accessToken } = await this.repository.findAndGenerateAccessToken(email, password);

        const refreshToken = await this.refreshRepository.generateNewRefreshToken(user);

        return new AuthTokenSerializer().serialize(accessToken, refreshToken.refreshToken, user);
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
    public async refreshOAuth(req: Request, res: Response, next) {
        const user = req.user;
        const { service } = req.params;
        const oAuthRepository = getRepository(OAuthToken);

        const OAuthTokens = await oAuthRepository.findOne({type : service as any, user});

        const {refreshToken, accessToken} = await new Promise((resolve, rej) => {
            Refresh.requestNewAccessToken(service, OAuthTokens.refreshToken,
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

        OAuthTokens.accessToken = accessToken;
        OAuthTokens.refreshToken = refreshToken;

        await oAuthRepository.save(user);

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
    public async oAuth(req: Request, res: Response, next) {
        const user = req.user;
        const accessToken = user.generateAccessToken();
        const token = await this.refreshRepository.generateNewRefreshToken(user);
        return new AuthTokenSerializer().serialize(accessToken, token.refreshToken, user);
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
    public async refresh(req: Request, res: Response, next) {
        const refreshTokenRepository = getRepository(RefreshToken);

        const {token} = req.body;

        const refreshObject = await refreshTokenRepository.findOne({
            where: {refreshToken: token}
        });

        if (!refreshObject) {
            throw Boom.forbidden("Invalid refresh token");
        }

        // Get owner user of the token
        const { user, accessToken } = await this.repository.findAndGenerateAccessToken(refreshObject.user.email, refreshObject);

        return new AuthTokenSerializer().serialize(accessToken, refreshObject.refreshToken, user);
    }
}

export {AuthController};
