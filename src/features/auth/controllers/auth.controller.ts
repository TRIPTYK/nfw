import { inject } from '@triptyk/nfw-core';
import { UserModel } from '../../users/models/user.model.js';
import { RefreshTokenModel } from '../models/refresh-token.model.js';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository.js';
import { ValidatedBody } from '../../../decorators/validated-body.js';
import { Roles } from '../../users/enums/roles.enum.js';
import type { RouterContext } from '@koa/router';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import { Controller, Ctx, POST, UseMiddleware } from '@triptyk/nfw-http';
import { AuthService } from '../services/auth.service.js';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InvalidUserNameOrPasswordError } from '../errors/invalid-username-or-password.js';
import { InvalidRefreshTokenError } from '../errors/invalid-refresh-token.js';
import { loginBodySchema, refreshBodySchema, registeredUserBodySchema } from '../validators/auth.validator.js';
import type { InferType } from 'yup';
import { createRateLimitMiddleware } from '../../../middlewares/rate-limit.middleware.js';

@Controller({
  routeName: '/auth',
})
export class AuthController {
  constructor (
    @injectRepository(RefreshTokenModel) private refreshTokenRepository: RefreshTokenRepository,
    @injectRepository(UserModel) private userRepository: EntityRepository<UserModel>,
    @inject(AuthService) private authService: AuthService,
  ) {}

  @POST('/register')
  @UseMiddleware(createRateLimitMiddleware(1000 * 60 * 15, 2, 'Please wait before creating another account'))
  public async register (
    @ValidatedBody(registeredUserBodySchema) body : InferType<typeof registeredUserBodySchema>,
    @Ctx() ctx: RouterContext,
  ) {
    const user = this.userRepository.create({ ...body, role: Roles.USER });
    user.password = await this.authService.hashPassword(body.password);
    await this.userRepository.getEntityManager().persistAndFlush(user);

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

    const accessToken = this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user);
    await this.refreshTokenRepository.getEntityManager().flush();

    return { accessToken, refreshToken: refreshToken.token };
  }

  @POST('/refresh-token')
  public async refreshToken (@ValidatedBody(refreshBodySchema) body: InferType<typeof refreshBodySchema>) {
    const refresh = await this.refreshTokenRepository.findOneOrFail({
      token: body.refreshToken,
    }, {
      failHandler: () => new InvalidRefreshTokenError(),
    });

    const user = refresh.user.unwrap();

    const accessToken = this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user);

    await this.refreshTokenRepository.getEntityManager().flush();

    return { accessToken, refreshToken: refreshToken.token };
  }
}
