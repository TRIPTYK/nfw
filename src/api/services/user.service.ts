import { singleton } from '@triptyk/nfw-core';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import { UserModel } from '../../database/models/user.model.js';
import * as JWT from 'jsonwebtoken';
import { InvalidBearerTokenError } from '../errors/invalid-bearer-token.js';
import type { EntityRepository } from '@mikro-orm/mysql';

@singleton()
export class UserService {
  public constructor (
    @injectRepository(UserModel) public userRepository: EntityRepository<UserModel>
  ) {

  }

  async tryLoadUserFromToken (bearer: string) {
    const [tokenType, token] = bearer.split(' ');

    if (tokenType === 'Bearer') {
      const decrypted = JWT.decode(token, { complete: true });
      const user = await this.userRepository.findOne({ id: decrypted?.payload.sub as string });
      if (!user) {
        throw new InvalidBearerTokenError();
      }
      return user;
    }

    throw new InvalidBearerTokenError();
  }
}
