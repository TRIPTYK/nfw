import * as HttpStatus from "http-status";
import * as Boom from "boom";

import {User} from "../models/user.model";
import {RefreshToken} from "../models/refresh-token.model";
import {Request, Response} from "express";
import {getCustomRepository, getRepository} from "typeorm";
import {UserRepository} from "../repositories/user.repository";
import {generateTokenResponse} from "../utils/auth.util";
import {BaseController} from "./base.controller";
import {env, jwtAuthMode} from "../../config/environment.config";
import {roles} from "../enums/role.enum";

/**
 * Authentification Controller!
 * @module controllers/auth.controller.ts
 */
class AuthController extends BaseController {

    protected repository;

    constructor() {
        super();
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
    async register(req: Request, res: Response, next: Function) {
        let user = new User(req.body);
        user.role = ['test', 'development'].includes(env.toLowerCase()) ? roles.admin : roles.user;
        user = await this.repository.save(user);
        const token = await generateTokenResponse(user, user.token(), req.ip);
        res.status(HttpStatus.CREATED);

        return {
            token
        }
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
    async login(req: Request, res: Response, next: Function) {
        const { force } = req.query;
        const { email , refreshObject } = req.body;

        const {user, accessToken} = await this.repository.findAndGenerateToken({
            email,ip : req.ip,refreshObject
        },jwtAuthMode === 'normal',force);
        const token = await generateTokenResponse(user, accessToken, req.ip);

        return {
            token
        }
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
    async oAuth(req: Request, res: Response, next: Function) {
        const user: User = req['user'];
        const accessToken = user.token();
        const token = await generateTokenResponse(user, accessToken, req.ip);
        token.user = user;

        return {
            token
        }
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
    async refresh(req: Request, res: Response, next: Function) {
        const refreshTokenRepository = getRepository(RefreshToken);

        const {token} = req.body;

        const refreshObject = await refreshTokenRepository.findOne({
            where: {refreshToken: token}
        });

        if (!refreshObject) return next(Boom.expectationFailed('RefreshObject cannot be empty'));

        await refreshTokenRepository.remove(refreshObject);
        // Get owner user of the token
        const { user, accessToken } = await this.repository.findAndGenerateToken({ email: refreshObject.user.email , refreshObject , ip : req.ip},true);
        const refreshedToken = await generateTokenResponse(user, accessToken , req.ip);

        return {
            token : refreshedToken
        }
    }

    protected beforeMethod(): void {
        this.repository = getCustomRepository(UserRepository);
    }
}

export {AuthController};