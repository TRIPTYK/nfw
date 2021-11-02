import { Body, Controller, GET, injectable, InjectRepository, inject, POST, UseMiddleware } from '@triptyk/nfw-core'
import { ConfigurationService } from '../services/configuration.service.js';
import { UserModel } from '../models/user.model.js';
import { UserRepository } from '../repositories/user.repository.js';
import createError from 'http-errors';
import { RefreshTokenModel } from '../models/refresh-token.model.js';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository.js';

@Controller('/auth')
@injectable()
export class AuthController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@inject(ConfigurationService) private configurationService: ConfigurationService,
               @InjectRepository(RefreshTokenModel) private refreshTokenRepository: RefreshTokenRepository,
               @InjectRepository(UserModel) private userRepository: UserRepository,
  ) {}

  @POST('/register')
  public async register (
    @Body() body : UserModel,
  ) {
    const user = this.userRepository.create(body);
    this.userRepository.persist(user);
    await this.userRepository.hashPassword(user, body.password);
    this.userRepository.flush();

    return user;
  }

  @POST('/login')
  public async login (@Body() body: any) {
    const { jwt } = await this.configurationService.getConfig();
    const user = await this.userRepository.findOne({ email: body.email });

    if (!user || !await user.passwordMatches(body.password)) {
      throw createError(417, 'Votre email ou mot de passe est incorrecte');
    }

    const accessToken = this.userRepository.generateAccessToken(user, jwt.accessExpires, jwt.secret);
    const refreshToken = await this.refreshTokenRepository.generateRefreshToken(user, jwt.refreshExpires);

    this.refreshTokenRepository.flush();
    return { accessToken, refreshToken };
  }

  @POST('/refresh-token')
  public async refreshToken (@Body() body: any) {
    const { jwt } = await this.configurationService.getConfig();
    const refresh = await this.refreshTokenRepository.findOne({ token: body.refreshToken });

    if (!refresh) {
      throw createError(417, 'Invalid refresh token');
    }

    const accessToken = this.userRepository.generateAccessToken(refresh.user, jwt.accessExpires, jwt.secret);
    const refreshToken = await this.refreshTokenRepository.generateRefreshToken(refresh.user, jwt.refreshExpires);

    this.refreshTokenRepository.remove(refresh);
    this.refreshTokenRepository.flush();

    return { accessToken, refreshToken };
  }
}
