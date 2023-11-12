import { inject, singleton } from '@triptyk/nfw-core';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import { UserModel } from '../models/user.model.js';
import * as JWT from 'jsonwebtoken';
import { InvalidBearerTokenError } from '../../auth/errors/invalid-bearer-token.js';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ConfigurationServiceImpl } from '../../../services/configuration.service.js';
import type { Env, ConfigurationService } from '../../../services/configuration.service.js';

@singleton()
export class UserService {
  public constructor (
    @injectRepository(UserModel) public userRepository: EntityRepository<UserModel>,
    @inject(ConfigurationServiceImpl) public configService: ConfigurationService<Env>,
  ) {

  }

  async tryLoadUserFromToken (bearer: string) {
    const [tokenType, token] = bearer.split(' ');

    if (this.isBearerToken(tokenType)) {
      try {
        const user = await this.loadUserFromToken(token);

        if (!user) {
          throw new InvalidBearerTokenError();
        }
        return user;
      } catch (e) {
        // catch-all for library
        throw new InvalidBearerTokenError();
      }
    }
    throw new InvalidBearerTokenError();
  }

  private isBearerToken (tokenType: string) {
    return tokenType === 'Bearer';
  }

  private loadUserFromToken (token: string) {
    const decrypted = JWT.verify(token, this.configService.get('JWT_SECRET'), { complete: true });
    return this.userRepository.findOne({ id: decrypted?.payload.sub as string });
  }
}
