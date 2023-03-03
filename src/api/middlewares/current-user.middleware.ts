import type { RouterContext } from '@koa/router';
import type { Next } from 'koa';
import { UserModel } from '../../database/models/user.model.js';
import type { UserRepository } from '../../database/repositories/user.repository.js';
import { injectable } from '@triptyk/nfw-core';
import type { MiddlewareInterface } from '@triptyk/nfw-http';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import * as JWT from 'jsonwebtoken';

export async function loadUserFromContext (context: RouterContext, userRepo: UserRepository) {
  if (context.header.authorization) {
    const bearerToken = context.header.authorization.split(' ');
    if (bearerToken[0] === 'Bearer') {
      const decrypted = JWT.decode(bearerToken[1], { complete: true });
      const user = await userRepo.findOne({ id: decrypted?.payload.sub as string });
      if (!user) {
        throw new Error('Invalid token');
      }
      return user;
    } else {
      throw new Error('Invalid token');
    }
  }
}

@injectable()
export class CurrentUserMiddleware implements MiddlewareInterface {
  constructor (@injectRepository(UserModel) private userRepository: UserRepository) {}

  async use (context: RouterContext, next: Next) {
    context.state.user = await loadUserFromContext(context, this.userRepository);
    await next();
  }
}
