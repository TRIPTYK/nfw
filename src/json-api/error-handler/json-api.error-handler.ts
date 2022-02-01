import type { RouterContext } from '@koa/router';
import type { ErrorHandlerInterface } from '@triptyk/nfw-core';
import { inject, injectable } from '@triptyk/nfw-core';
import type { HttpError } from 'http-errors';
import { isHttpError } from 'http-errors';
import JSONAPISerializer from 'json-api-serializer';
import { ConfigurationService } from '../../api/services/configuration.service.js';
import { LoggerService } from '../../api/services/logger.service.js';

@injectable()
export class JsonApiErrorHandler implements ErrorHandlerInterface {
  private jsonApiErrorSerializer: JSONAPISerializer;

  // eslint-disable-next-line no-useless-constructor
  constructor (@inject(LoggerService) private loggerService: LoggerService, @inject(ConfigurationService) private configurationService: ConfigurationService) {
    this.jsonApiErrorSerializer = new JSONAPISerializer();
  }

  async handle (error: Error | HttpError | Record<string, unknown>[], context: RouterContext) {
    this.loggerService.logger.trace(error);

    if (Array.isArray(error)) {
      context.response.status = 400;
      const errors = error.map((e) => {
        return {
          title: 'validationError',
          message: e.message,
          meta: e,
          status: '400',
        };
      });
      context.response.body = this.jsonApiErrorSerializer.serializeError(errors);
      return;
    }

    const isDev = this.configurationService.getKey('env', 'development') === 'development';

    if (isHttpError(error)) {
      context.response.status = error.statusCode;
      context.response.body = this.jsonApiErrorSerializer.serializeError({
        title: error.name,
        code: error.name,
        message: error.message,
        status: error.statusCode.toString(),
      });
    } else {
      context.response.status = 500;
      context.response.body = this.jsonApiErrorSerializer.serializeError({
        title: error.name,
        code: 'internalError',
        detail: isDev ? error.message : 'Internal server error',
        status: '500',
      });
    }
  }
}
