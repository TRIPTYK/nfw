import type { RouterContext } from '@koa/router';
import type { MiddlewareInterface } from '@triptyk/nfw-core';
import { inject, injectable } from '@triptyk/nfw-core';
import { LoggerService } from '../services/logger.service.js';
import type { Next } from 'koa';
import type { UserModel } from '../models/user.model.js';

@injectable()
export class LogMiddleware implements MiddlewareInterface {
  // eslint-disable-next-line no-useless-constructor
  constructor (@inject(LoggerService) private loggerService: LoggerService) {}

  async use (context: RouterContext, next: Next) {
    this.loggerService.logger.log(context.method, context.url, (context.state.user as UserModel)?.id ?? 'anonymous', context.ip);
    await next();
  }
}
