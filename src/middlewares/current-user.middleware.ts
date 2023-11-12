import type { RouterContext } from '@koa/router';
import type { Next } from 'koa';
import { inject, injectable } from '@triptyk/nfw-core';
import type { MiddlewareInterface } from '@triptyk/nfw-http';
import { UserService } from '../features/users/services/user.service.js';

@injectable()
export class CurrentUserMiddleware implements MiddlewareInterface {
  constructor (
    @inject(UserService) private userService: UserService,
  ) {}

  async use (context: RouterContext, next: Next) {
    if (context.headers.authorization) {
      context.state.user = await this.userService.tryLoadUserFromToken(context.headers.authorization);
    }
    await next();
  }
}
