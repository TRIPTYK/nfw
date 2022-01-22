import { RouterContext } from '@koa/router';
import { inject, injectable, MiddlewareInterface } from '@triptyk/nfw-core';
import { LoggerService } from '../services/logger.service.js';
import { Next } from 'koa';
import { UserModel } from '../models/user.model.js';

@injectable()
export class LogMiddleware implements MiddlewareInterface {
  // eslint-disable-next-line no-useless-constructor
  constructor (@inject(LoggerService) private loggerService: LoggerService) {}

  async use (context: RouterContext, next: Next) {
    this.loggerService.logger.log(context.method, context.url, (context.state.user as UserModel)?.id ?? 'anonymous', context.ip);
    await next();
  }
}
