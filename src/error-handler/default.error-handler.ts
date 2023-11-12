import type { RouterContext } from '@koa/router';
import { inject, injectable } from '@triptyk/nfw-core';
import type { MiddlewareInterface } from '@triptyk/nfw-http';
import type { Next } from 'koa';
import { ValidationError } from 'yup';
import { NotFoundError } from '../errors/not-found.js';
import { WebError } from '../errors/web-error.js';
import type { ConfigurationService, Env } from '../services/configuration.service.js';
import { ConfigurationServiceImpl } from '../services/configuration.service.js';
import { LoggerServiceImpl } from '../services/logger.service.js';
import type { LoggerService } from '../services/logger.service.js';

@injectable()
export class DefaultErrorHandler implements MiddlewareInterface {
  constructor (
    @inject(LoggerServiceImpl) private loggerService: LoggerService,
    @inject(ConfigurationServiceImpl) private configurationService: ConfigurationService<Env>) {
  }

  async use (context: RouterContext, next: Next) {
    try {
      await next();
      this.rejectUnhandled(context);
    } catch (error: any) {
      this.loggerService.error(error);

      if (this.isValidationError(error)) {
        this.sendValidationErrors(context, error);
        return;
      }

      if (error instanceof WebError) {
        this.sendWebError(context, error);
        return;
      }

      this.sendDefaultError(context, error);
    }
  }

  private sendWebError (context: RouterContext, error: WebError) {
    context.status = error.status;
    context.body = {
      message: error.message
    };
  }

  private isValidationError (error: unknown) {
    return error instanceof ValidationError;
  }

  private rejectUnhandled (context: RouterContext) {
    if (context.status === 404) {
      throw new NotFoundError();
    }
  }

  private sendValidationErrors (context: RouterContext, error: ValidationError) {
    context.status = 400;
    context.body = error.inner.map((e: ValidationError) => {
      return {
        title: 'validationError',
        message: e.message,
        meta: {
          path: e.path,
          value: e.value,
          type: e.type
        }
      };
    });
  }

  private sendDefaultError (context: RouterContext, error: any) {
    const isProductionEnv = this.configurationService.get('PRODUCTION_ENV');
    context.status = 500;
    context.body = {
      message: isProductionEnv ? 'Internal server error' : error.message
    };
  }
}
