import { inject } from '@triptyk/nfw-core';
import type { ConfigurationService, Env } from '../services/configuration.service.js';
import { ConfigurationServiceImpl } from '../services/configuration.service.js';
import { UserModel } from '../../database/models/user.model.js';
import type { UserRepository } from '../../database/repositories/user.repository.js';
import createError from 'http-errors';
import { RefreshTokenModel } from '../../database/models/refresh-token.model.js';
import type { RefreshTokenRepository } from '../../database/repositories/refresh-token.repository.js';
import { ValidatedBody } from '../decorators/validated-body.js';
import { ValidatedLoginBody, ValidatedRefreshBody, ValidatedRegisteredUserBody } from '../validators/auth.validator.js';
import { createRateLimitMiddleware } from '../middlewares/rate-limit.middleware.js';
import { Roles } from '../enums/roles.enum.js';
import type { RouterContext } from '@koa/router';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import { Controller, Ctx, POST, UseMiddleware } from '@triptyk/nfw-http';

@Controller({
  routeName: '/auth'
})
export class AuthController {
  constructor (
    @inject(ConfigurationServiceImpl) private configurationService: ConfigurationService<Env>,
    @injectRepository(RefreshTokenModel) private refreshTokenRepository: RefreshTokenRepository,
    @injectRepository(UserModel) private userRepository: UserRepository
  ) {}

  @POST('/register')
  @UseMiddleware(createRateLimitMiddleware(1000 * 60 * 15, 2, 'Please wait before creating another account'))
  public async register (
    @ValidatedBody(ValidatedRegisteredUserBody) body : ValidatedRegisteredUserBody,
    @Ctx() ctx: RouterContext
  ) {
    const user = this.userRepository.create({ ...body, role: Roles.USER });
    user.role = Roles.USER;
    user.password = await this.userRepository.hashPassword(body.password);
    await this.userRepository.persistAndFlush(user);

    ctx.response.status = 201;
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };
  }

  @POST('/login')
  public async login (@ValidatedBody(ValidatedLoginBody) body: ValidatedLoginBody) {
    const user = await this.userRepository.findOne({ email: body.email });

    if (!user || !await user.passwordMatches(body.password)) {
      throw createError(417, 'Votre email ou mot de passe est incorrect');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    await this.refreshTokenRepository.flush();

    return { accessToken, refreshToken: refreshToken.token };
  }

  private async generateRefreshToken (user: UserModel) {
    return this.refreshTokenRepository.generateRefreshToken(
      user,
      this.configurationService.get('REFRESH_TOKEN_EXPIRES')
    );
  }

  private generateAccessToken (user: UserModel) {
    return this.userRepository.generateAccessToken(
      user,
      this.configurationService.get('JWT_EXPIRES'),
      this.configurationService.get('JWT_SECRET'),
      this.configurationService.get('JWT_ISS'),
      this.configurationService.get('JWT_AUDIENCE')
    );
  }

  @POST('/refresh-token')
  public async refreshToken (@ValidatedBody(ValidatedRefreshBody) body: ValidatedRefreshBody) {
    const refresh = await this.refreshTokenRepository.findOneOrFail({
      token: body.refreshToken
    }, {
      failHandler: () => createError(417, 'Invalid refresh token')
    });

    const user = refresh.user.unwrap();

    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    await this.refreshTokenRepository.removeAndFlush(refresh);

    return { accessToken, refreshToken: refreshToken.token };
  }
}
