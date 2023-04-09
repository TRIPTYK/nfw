import { inject } from '@triptyk/nfw-core';
import type { ConfigurationService, Env } from '../services/configuration.service.js';
import { ConfigurationServiceImpl } from '../services/configuration.service.js';
import { UserModel } from '../../database/models/user.model.js';
import { RefreshTokenModel } from '../../database/models/refresh-token.model.js';
import type { RefreshTokenRepository } from '../../database/repositories/refresh-token.repository.js';
import { ValidatedBody } from '../decorators/validated-body.js';
import { createRateLimitMiddleware } from '../middlewares/rate-limit.middleware.js';
import { Roles } from '../enums/roles.enum.js';
import type { RouterContext } from '@koa/router';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import { Controller, Ctx, POST, UseMiddleware } from '@triptyk/nfw-http';
import { AuthService } from '../services/auth.service.js';
import type { EntityRepository } from '@mikro-orm/mysql';
import { InvalidUserNameOrPasswordError } from '../errors/invalid-username-or-password.js';
import { InvalidRefreshTokenError } from '../errors/invalid-refresh-token.js';
import { loginBodySchema, refreshBodySchema, registeredUserBodySchema } from '../validators/auth.validator.js';
import type { InferType } from 'yup';

@Controller({
  routeName: '/auth'
})
export class AuthController {
  constructor (
    @inject(ConfigurationServiceImpl) private configurationService: ConfigurationService<Env>,
    @injectRepository(RefreshTokenModel) private refreshTokenRepository: RefreshTokenRepository,
    @injectRepository(UserModel) private userRepository: EntityRepository<UserModel>,
    @inject(AuthService) private authService: AuthService
  ) {}

  @POST('/register')
  @UseMiddleware(createRateLimitMiddleware(1000 * 60 * 15, 2, 'Please wait before creating another account'))
  public async register (
    @ValidatedBody(registeredUserBodySchema) body : InferType<typeof registeredUserBodySchema>,
    @Ctx() ctx: RouterContext
  ) {
    const user = this.userRepository.create({ ...body, role: Roles.USER });
    user.password = await this.authService.hashPassword(body.password);
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
  public async login (@ValidatedBody(loginBodySchema) body: InferType<typeof loginBodySchema>) {
    const user = await this.userRepository.findOne({ email: body.email });

    if (!user || !await user.passwordMatches(body.password)) {
      throw new InvalidUserNameOrPasswordError();
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
    return this.authService.generateAccessToken(
      user,
      this.configurationService.get('JWT_EXPIRES'),
      this.configurationService.get('JWT_SECRET'),
      this.configurationService.get('JWT_ISS'),
      this.configurationService.get('JWT_AUDIENCE')
    );
  }

  @POST('/refresh-token')
  public async refreshToken (@ValidatedBody(refreshBodySchema) body: InferType<typeof refreshBodySchema>) {
    const refresh = await this.refreshTokenRepository.findOneOrFail({
      token: body.refreshToken
    }, {
      failHandler: () => new InvalidRefreshTokenError()
    });

    const user = refresh.user.unwrap();

    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    await this.refreshTokenRepository.removeAndFlush(refresh);

    return { accessToken, refreshToken: refreshToken.token };
  }
}
