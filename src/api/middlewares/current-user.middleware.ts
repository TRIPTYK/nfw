import type { RouterContext } from '@koa/router';
import type { Next } from 'koa';
import { inject, injectable } from '@triptyk/nfw-core';
import type { MiddlewareInterface } from '@triptyk/nfw-http';
import { UserService } from '../services/user.service.js';

@injectable()
export class CurrentUserMiddleware implements MiddlewareInterface {
  constructor (
    @inject(UserService) private userService: UserService
  ) {}

  async use (context: RouterContext, next: Next) {
    context.state.user = await this.userService.tryLoadUserFromToken(context.headers.authorization ?? '');
    await next();
  }
}
