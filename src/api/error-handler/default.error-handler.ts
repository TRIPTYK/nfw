import type { RouterContext } from '@koa/router';
import { inject, injectable } from '@triptyk/nfw-core';
import type { MiddlewareInterface } from '@triptyk/nfw-http';
import { isHttpError } from 'http-errors';
import type { Next } from 'koa';
import { ConfigurationService } from '../services/configuration.service.js';
import { LoggerService } from '../services/logger.service.js';

@injectable()
export class DefaultErrorHandler implements MiddlewareInterface {
  // eslint-disable-next-line no-useless-constructor
  constructor (@inject(LoggerService) private loggerService: LoggerService, @inject(ConfigurationService) private configurationService: ConfigurationService) {}

  async use (context: RouterContext, next: Next) {
    try {
      await next();
    } catch (error: any) {
      const isDev = this.configurationService.getKey('env', 'development') === 'development';
      this.loggerService.logger.trace(error);

      if (Array.isArray(error)) {
        context.response.status = 400;
        context.response.body = error.map((e) => {
          return {
            title: 'validationError',
            message: e.message,
            meta: e,
            status: '400',
          };
        });
        return;
      }

      if (isHttpError(error)) {
        context.response.status = error.statusCode;
        context.response.body = {
          message: error.message,
        };
      } else {
        context.response.status = 500;
        context.response.body = {
          message: isDev ? error.message : 'Internal server error',
          code: context.response.status,
        };
      }
    }
  }
}
