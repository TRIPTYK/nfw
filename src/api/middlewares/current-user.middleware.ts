import type { RouterContext } from '@koa/router';
import type { Next } from 'koa';
import { injectable } from '@triptyk/nfw-core';
import type { MiddlewareInterface } from '@triptyk/nfw-http';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import { UserService } from '../services/user.service.js';

@injectable()
export class CurrentUserMiddleware implements MiddlewareInterface {
  constructor (
    @injectRepository(UserService) private userService: UserService
  ) {}

  async use (context: RouterContext, next: Next) {
    context.state.user = await this.userService.tryLoadUserFromToken(context.headers.authorization ?? '');
    await next();
  }
}
