import type { RouterContext } from '@koa/router';
import { inject, injectable } from '@triptyk/nfw-core';
import type { MiddlewareInterface } from '@triptyk/nfw-http';
import type { Next } from 'koa';
import { ValidationError } from 'yup';
import { NotFoundError } from '../errors/web/not-found.js';
import { WebError } from '../errors/web/web-error.js';
import type { ConfigurationService, Env } from '../services/configuration.service.js';
import { ConfigurationServiceImpl } from '../services/configuration.service.js';
import type { LoggerService } from '../services/logger.service.js';
import { LoggerServiceImpl } from '../services/logger.service.js';

@injectable()
export class DefaultErrorHandler implements MiddlewareInterface {
  constructor (
    @inject(LoggerServiceImpl) private loggerService: LoggerService,
    @inject(ConfigurationServiceImpl) private configurationService: ConfigurationService<Env>) {
  }

  async use (context: RouterContext, next: Next) {
    try {
      await next();
      rejectUnhandled();
    } catch (error: any) {
      this.loggerService.error(error);

      if (isValidationError(error)) {
        this.sendValidationErrors(context, error);
        return;
      }

      if (error instanceof WebError) {
        sendWebError(error);
        return;
      }

      this.sendDefaultError(context, error);
    }

    function sendWebError(error: WebError) {
      context.status = error.status;
      context.body = {
        message: error.message
      };
    }

    function isValidationError(error: unknown) {
      return Array.isArray(error) && error.every((error) => error instanceof ValidationError);
    }

    function rejectUnhandled() {
      if (context.status === 404) {
        throw new NotFoundError();
      }
    }
  }

  private sendValidationErrors(context: RouterContext, error: any) {
    context.status = 400;
    context.body = error.map((e: ValidationError) => {
      return {
        title: 'validationError',
        message: e.message,
        meta: e,
        status: '400'
      };
    });
  }

  private sendDefaultError(context: RouterContext, error: any) {
    const isProductionEnv = this.configurationService.get('PRODUCTION_ENV');
    context.status = 500;
    context.body = {
      message: isProductionEnv ? 'Internal server error': error.message
    };
  }
}
