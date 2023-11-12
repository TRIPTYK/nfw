import type { RouterContext } from '@koa/router';
import { inject, injectable } from '@triptyk/nfw-core';
import { LoggerServiceImpl } from '../services/logger.service.js';
import type { LoggerService } from '../services/logger.service.js';
import type { Next } from 'koa';
import type { UserModel } from '../features/users/models/user.model.js';
import type { MiddlewareInterface } from '@triptyk/nfw-http';

@injectable()
export class LogMiddleware implements MiddlewareInterface {
  constructor (@inject(LoggerServiceImpl) private loggerService: LoggerService) {}

  async use (context: RouterContext, next: Next) {
    this.loggerService.info(context.method, context.url, (context.state.user as UserModel)?.id ?? 'anonymous', context.ip);
    await next();
  }
}
