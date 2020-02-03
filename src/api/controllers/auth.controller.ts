
import * as HttpStatus from "http-status";
import {RefreshToken} from "../models/refresh-token.model";
import {Request, Response} from "express";
import {getCustomRepository, getRepository} from "typeorm";
import {UserRepository} from "../repositories/user.repository";
import {Roles} from "../enums/role.enum";
import {RefreshTokenRepository} from "../repositories/refresh-token.repository";
import Refresh from "passport-oauth2-refresh";
import { AuthTokenSerializer } from "../serializers/auth-token.serializer";
import EnvironmentConfiguration from "../../config/environment.config";
import { Environments } from "../enums/environments.enum";
import * as Boom from "@hapi/boom";
import { OAuthToken } from "../models/oauth-token.model";
import { Controller, Post, MethodMiddleware, Get } from "../decorators/controller.decorator";
import SecurityMiddleware from "../middlewares/security.middleware";
import DeserializeMiddleware from "../middlewares/deserialize.middleware";
import { UserSerializer } from "../serializers/user.serializer";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { register } from "../validations/auth.validation";

/**
 * Authentification Controller!
 * @module controllers/auth.controller.ts
 */
@Controller("auth")
export default class AuthController {
    protected repository: UserRepository;
    private refreshRepository: RefreshTokenRepository;

    constructor() {
        this.repository = getCustomRepository(UserRepository);
        this.refreshRepository = getCustomRepository(RefreshTokenRepository);
    }

    @Post()
    @MethodMiddleware(DeserializeMiddleware, UserSerializer)
    @MethodMiddleware(ValidationMiddleware, {schema : register})
    @MethodMiddleware(SecurityMiddleware)
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

    @Post()
    public async login(req: Request, res: Response) {
        const { email , password } = req.body;
        const { user, accessToken } = await this.repository.findAndGenerateAccessToken(email, password);
        const refreshToken = await this.refreshRepository.generateNewRefreshToken(user);

        return new AuthTokenSerializer().serialize(accessToken, refreshToken.refreshToken, user);
    }

    @Post("/:service/refresh-token")
    public async refreshOAuth(req: Request, res: Response, next) {
        const user = req.user;
        const { service } = req.params;

        const oAuthRepository = getRepository(OAuthToken);
        const OAuthTokens = await oAuthRepository.findOne({type : service as any, user});

        if (!OAuthTokens) {
            throw Boom.forbidden(`No ${service} account linked`);
        }

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

        await oAuthRepository.save(OAuthTokens);

        res.sendStatus(HttpStatus.OK);
    }

    @Post("/oAuth")
    public async oAuth(req: Request, res: Response, next) {
        const user = req.user;
        const accessToken = user.generateAccessToken();
        const token = await this.refreshRepository.generateNewRefreshToken(user);
        return new AuthTokenSerializer().serialize(accessToken, token.refreshToken, user);
    }

    @Post("/refresh-token")
    public async refresh(req: Request, res: Response, next) {
        const refreshTokenRepository = getRepository(RefreshToken);

        const {refreshToken} = req.body;

        const refreshObject = await refreshTokenRepository.findOne({
            where: {refreshToken}
        });

        if (!refreshObject) {
            throw Boom.forbidden("Invalid refresh token");
        }

        // Get owner user of the token
        const { user, accessToken } = await this.repository.findAndGenerateAccessToken(refreshObject.user.email, refreshObject);

        return new AuthTokenSerializer().serialize(accessToken, refreshObject.refreshToken, user);
    }
}
