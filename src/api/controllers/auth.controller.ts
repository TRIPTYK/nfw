import * as Boom from "@hapi/boom";
import {
    BaseController,
    ConfigurationService,
    Controller,
    DeepPartial,
    getCustomRepository,
    getRepository,
    MethodMiddleware,
    Post,
} from "@triptyk/nfw-core";
import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import {
    SecurityMiddleware,
    SecurityMiddlewareArgs
} from "../middlewares/security.middleware";
import { User } from "../models/user.model";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";
import { UserRepository } from "../repositories/user.repository";

/**
 * Authentification Controller!
 * Not a JSON-API controller
 */
@Controller("/auth")
@autoInjectable()
export class AuthController extends BaseController {
    // can't inject repositories
    private repository: UserRepository;
    private refreshRepository: RefreshTokenRepository;

    constructor(public configurationService: ConfigurationService) {
        super();
        this.repository = getCustomRepository(UserRepository);
        this.refreshRepository = getCustomRepository(RefreshTokenRepository);
    }

    @Post("/register")
    public async register(req: Request, res: Response): Promise<any> {
        let user = this.repository.create(req.body as DeepPartial<User>);
        await this.repository.save(user);
        const refresh =  await this.refreshRepository.generate(user, this.configurationService.config.jwt.refreshExpires);
        const accessToken = this.repository.generateAccessToken(user,this.configurationService.config.jwt.accessExpires,this.configurationService.config.jwt.secret);

        return {
            refresh: refresh.refreshToken,
            accessToken: accessToken
        }
    }

    @Post("/")
    public async login(req: Request): Promise<any> {
        
    }

    @Post("/refresh-token")
    public async refresh(req: Request): Promise<any> {
        
    }
}
