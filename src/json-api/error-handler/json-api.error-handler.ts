import { RouterContext } from '@koa/router';
import { ErrorHandlerInterface, inject, injectable } from '@triptyk/nfw-core';
import { isHttpError } from 'http-errors';
import JSONAPISerializer from 'json-api-serializer';
import { LoggerService } from '../../api/services/logger.service.js';

@injectable()
export class DefaultErrorHandler implements ErrorHandlerInterface {
    private jsonApiErrorSerializer: JSONAPISerializer;

    // eslint-disable-next-line no-useless-constructor
    constructor (@inject(LoggerService) private loggerService: LoggerService) {
      this.jsonApiErrorSerializer = new JSONAPISerializer();
    }

    async handle (error: any, context: RouterContext) {
      this.loggerService.logger.trace(error);
      if (isHttpError(error)) {
        context.response.status = error.statusCode;
        context.response.body = this.jsonApiErrorSerializer.serializeError(error);
      } else {
        context.response.status = 500;
        context.response.body = this.jsonApiErrorSerializer.serializeError({
          detail: 'Internal Server Error',
        });
      }
    }
}
