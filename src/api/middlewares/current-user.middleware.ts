import { RouterContext } from '@koa/router'
import { inject, injectable, InjectRepository, MiddlewareInterface } from '@triptyk/nfw-core'
import * as Jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import { UserRepository } from '../repositories/user.repository.js';

@injectable()
export class CurrentUserMiddleware implements MiddlewareInterface {
  constructor (@InjectRepository(UserModel) private userRepository: UserRepository) {}

  async use (context: RouterContext) {
    if (context.header.authorization) {
      const bearerToken = context.header.authorization.split(' ');
      if (bearerToken[0] === 'Bearer') {
        const decrypted = Jwt.decode(bearerToken[1], { complete: true });
        const user = await this.userRepository.findOne({ id: decrypted?.payload.sub })
        context.state.user = user;
      }
    }
  }
}
