import { inject, injectable, singleton } from '@triptyk/nfw-core';
import { unixTimestamp } from '../utils/date.js';
import * as Jwt from 'jsonwebtoken';
import { hash } from 'bcrypt';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import { RefreshTokenModel } from '../../database/models/refresh-token.model.js';
import type { UserModel } from '../../database/models/user.model.js';
import type { RefreshTokenRepository } from '../../database/repositories/refresh-token.repository.js';
import type { ConfigurationService, Env } from './configuration.service.js';
import { ConfigurationServiceImpl } from './configuration.service.js';

@singleton()
@injectable()
export class AuthService {
  public constructor (
    @injectRepository(RefreshTokenModel) public refreshTokenRepository: RefreshTokenRepository,
    @inject(ConfigurationServiceImpl) public configurationService: ConfigurationService<Env>
  ) {

  }

  public generateAccessToken (userId: string): string {
    const now = unixTimestamp();
    const payload = {
      exp: now + this.configurationService.get('JWT_EXPIRES') * 60,
      iat: now,
      sub: userId
    };

    return (Jwt as any).default.sign(payload, this.configurationService.get('JWT_SECRET'), { algorithm: 'HS512', issuer: this.configurationService.get('JWT_ISS'), notBefore: -1, audience: this.configurationService.get('JWT_AUDIENCE') });
  }

  public generateRefreshToken (user: UserModel) {
    return this.refreshTokenRepository.generateRefreshToken(
      user,
      this.configurationService.get('REFRESH_TOKEN_EXPIRES')
    );
  }

  public hashPassword (password: string): Promise<string> {
    return hash(password, 10);
  }
}
