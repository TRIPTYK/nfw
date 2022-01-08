import { RouterContext } from '@koa/router';
import { Next } from 'koa';
import { injectable, InjectRepository, MiddlewareInterface } from '@triptyk/nfw-core'
import * as Jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import { UserRepository } from '../repositories/user.repository.js';

export async function loadUserFromContext (context: RouterContext, userRepo: UserRepository) {
  if (context.header.authorization) {
    const bearerToken = context.header.authorization.split(' ');
    if (bearerToken[0] === 'Bearer') {
      const decrypted = Jwt.decode(bearerToken[1], { complete: true });
      const user = await userRepo.findOne({ id: decrypted?.payload.sub })
      return user;
    } else {
      throw new Error('Invalid token');
    }
  }
}

@injectable()
export class CurrentUserMiddleware implements MiddlewareInterface {
  // eslint-disable-next-line no-useless-constructor
  constructor (@InjectRepository(UserModel) private userRepository: UserRepository) {}

  async use (context: RouterContext, next: Next) {
    context.state.user = await loadUserFromContext(context, this.userRepository);
    await next();
  }
}
