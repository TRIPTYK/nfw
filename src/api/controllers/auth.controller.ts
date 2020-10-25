import * as HttpStatus from "http-status";
import {RefreshToken} from "../models/refresh-token.model";
import {Request, Response} from "express";
import {DeepPartial, getCustomRepository, getRepository} from "typeorm";
import {UserRepository} from "../repositories/user.repository";
import {RefreshTokenRepository} from "../repositories/refresh-token.repository";
import Refresh from "passport-oauth2-refresh";
import { AuthTokenSerializer } from "../serializers/auth-token.serializer";
import * as Boom from "@hapi/boom";
import { OAuthToken } from "../models/oauth-token.model";
import { Controller, Post, MethodMiddleware } from "../../core/decorators/controller.decorator";
import SecurityMiddleware, { SecurityMiddlewareArgs } from "../middlewares/security.middleware";
import DeserializeMiddleware, { DeserializeMiddlewareArgs } from "../../core/middlewares/deserialize.middleware";
import { UserSerializer } from "../serializers/user.serializer";
import { register } from "../validations/auth.validation";
import { singleton, autoInjectable } from "tsyringe";
import { User } from "../models/user.model";
import ValidationMiddleware, { ValidationMiddlewareArgs } from "../../core/middlewares/validation.middleware";
import BaseController from "../../core/controllers/base.controller";

/**
 * Authentification Controller!
 * Not a JSON-API controller
 */
@Controller("auth")
@singleton()
@autoInjectable()
export default class AuthController extends BaseController {
    // can't inject repositories
    private repository: UserRepository;
    private refreshRepository: RefreshTokenRepository;

    public constructor() {
        super();
        this.repository = getCustomRepository(UserRepository);
        this.refreshRepository = getCustomRepository(RefreshTokenRepository);
    }

    @Post()
    @MethodMiddleware<DeserializeMiddlewareArgs>(DeserializeMiddleware, {serializer: UserSerializer, schema:"default" })
    @MethodMiddleware<ValidationMiddlewareArgs>(ValidationMiddleware, {schema : register})
    @MethodMiddleware<SecurityMiddlewareArgs>(SecurityMiddleware)
    public async register(req: Request, res: Response): Promise<any> {
        let user = this.repository.create(req.body as DeepPartial<User>);
        user = await this.repository.save(user);
        const accessToken = user.generateAccessToken();
        const refreshToken = await this.refreshRepository.generateNewRefreshToken(user);
        res.status(HttpStatus.CREATED);

        return new AuthTokenSerializer().serialize(accessToken, refreshToken.refreshToken, user);
    }

    @Post()
    public async login(req: Request): Promise<any> {
        const { email, password } = req.body;
        const { user, accessToken } = await this.repository.findAndGenerateAccessToken(email, password);
        const refreshToken = await this.refreshRepository.generateNewRefreshToken(user);

        return new AuthTokenSerializer().serialize(accessToken, refreshToken.refreshToken, user);
    }

    @Post("/:service/refresh-token")
    public async refreshOAuth(req: Request, res: Response): Promise<void> {
        const user = req.user;
        const { service } = req.params;

        const oAuthRepository = getRepository(OAuthToken);
        const OAuthTokens = await oAuthRepository.findOne({type : service as any, user});

        if (!OAuthTokens) {
            throw Boom.forbidden(`No ${service} account linked`);
        }

        const {refreshToken, accessToken} = await new Promise((resolve, rej) => {
            Refresh.requestNewAccessToken(service, OAuthTokens.refreshToken,
                (err, newAccessToken, newRefreshToken) => {
                    if (err) { rej(err); }
                    resolve({
                        accessToken : newAccessToken,
                        refreshToken : newRefreshToken
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
    public async oAuth(req: Request): Promise<any> {
        const user = req.user as User;
        const accessToken = user.generateAccessToken();
        const token = await this.refreshRepository.generateNewRefreshToken(user);
        return new AuthTokenSerializer().serialize(accessToken, token.refreshToken, user);
    }

    @Post("/refresh-token")
    public async refresh(req: Request): Promise<any> {
        const refreshTokenRepository = getRepository(RefreshToken);

        const {refreshToken} = req.body;

        const refreshObject = await refreshTokenRepository.findOne({
            where: {refreshToken}
        });

        if (!refreshObject) {
            throw Boom.badRequest("Invalid refresh token");
        }

        // Get owner user of the token
        const { user, accessToken } = await this.repository.findAndGenerateAccessToken(refreshObject.user.email, refreshObject);

        return new AuthTokenSerializer().serialize(accessToken, refreshObject.refreshToken, user);
    }
}
