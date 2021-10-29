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
  constructor (@InjectRepository(UserModel) private userRepository: UserRepository, 
               @inject(ConfigurationService) private configurationService: ConfigurationService,
               @InjectRepository(RefreshTokenModel) private refreshTokenRepository: RefreshTokenRepository) {}

  @POST('/register')
  public async register (
    @Body() body : UserModel
  ) {
    const allUsers = this.userRepository.create(body);
    this.userRepository.persist(allUsers);
    await this.userRepository.hashPassword(allUsers, body.password);
    this.userRepository.flush();

    return allUsers;
  }

  @POST('/login')
  public async login (@Body() body: any) {
    const { jwt } = this.configurationService.config;
    const user = await this.userRepository.findOne({ email: body.email });
    console.log(user, await user?.passwordMatches(body.password));
    if (!user || !await user.passwordMatches(body.password)) {
      throw createError(417, 'Votre email ou mot de passe est incorrecte');
    }
    const accessToken = this.userRepository.generateAccessToken(user, jwt.accessExpires, jwt.secret);
    const refreshToken = this.refreshTokenRepository.generateRefreshToken(user, jwt.refreshExpires);
    return { accessToken, refreshToken };
  }

  @GET('/refresh-token')
  public async refreshToken () {
    return 'refresh';
  }
}
