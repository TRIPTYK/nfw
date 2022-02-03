import { Controller, injectable, InjectRepository, inject, POST, UseMiddleware, Ctx } from '@triptyk/nfw-core';
import { ConfigurationService } from '../services/configuration.service.js';
import { UserModel } from '../models/user.model.js';
import type { UserRepository } from '../repositories/user.repository.js';
import createError from 'http-errors';
import { RefreshTokenModel } from '../models/refresh-token.model.js';
import type { RefreshTokenRepository } from '../repositories/refresh-token.repository.js';
import { ValidatedBody } from '../decorators/validated-body.js';
import { ValidatedLoginBody, ValidatedRefreshBody, ValidatedRegisteredUserBody } from '../validators/auth.validator.js';
import { createRateLimitMiddleware } from '../middlewares/rate-limit.middleware.js';
import { Roles } from '../enums/roles.enum.js';
import type { RouterContext } from '@koa/router';

@Controller('/auth')
@injectable()
export class AuthController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@inject(ConfigurationService) private configurationService: ConfigurationService,
               @InjectRepository(RefreshTokenModel) private refreshTokenRepository: RefreshTokenRepository,
               @InjectRepository(UserModel) private userRepository: UserRepository,
  ) {}

  @POST('/register')
  @UseMiddleware(createRateLimitMiddleware(1000 * 60 * 15, 2, 'Please wait before creating another account'))
  public async register (
    @ValidatedBody(ValidatedRegisteredUserBody) body : ValidatedRegisteredUserBody,
    @Ctx() ctx: RouterContext,
  ) {
    const user = this.userRepository.create(body);
    user.role = Roles.USER;
    user.password = await this.userRepository.hashPassword(body.password);
    await this.userRepository.persistAndFlush(user);

    // override status
    ctx.response.status = 201;
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }

  @POST('/login')
  public async login (@ValidatedBody(ValidatedLoginBody) body: ValidatedLoginBody) {
    const { accessExpires, refreshExpires, secret, iss, audience } = this.configurationService.getKey('jwt');
    const user = await this.userRepository.findOne({ email: body.email });

    if (!user || !await user.passwordMatches(body.password)) {
      throw createError(417, 'Votre email ou mot de passe est incorrect');
    }

    const accessToken = this.userRepository.generateAccessToken(user, accessExpires, secret, iss, audience);
    const refreshToken = await this.refreshTokenRepository.generateRefreshToken(user, refreshExpires);
    await this.refreshTokenRepository.flush();

    return { accessToken, refreshToken: refreshToken.token };
  }

  @POST('/refresh-token')
  public async refreshToken (@ValidatedBody(ValidatedRefreshBody) body: ValidatedRefreshBody) {
    const jwt = this.configurationService.getKey('jwt');
    const refresh = await this.refreshTokenRepository.findOne({ token: body.refreshToken });

    if (!refresh) {
      throw createError(417, 'Invalid refresh token');
    }

    const accessToken = this.userRepository.generateAccessToken(refresh.user, jwt.accessExpires, jwt.secret, jwt.iss, jwt.audience);
    const refreshToken = await this.refreshTokenRepository.generateRefreshToken(refresh.user, jwt.refreshExpires);

    this.refreshTokenRepository.remove(refresh);
    await this.refreshTokenRepository.flush();

    return { accessToken, refreshToken: refreshToken.token };
  }
}
