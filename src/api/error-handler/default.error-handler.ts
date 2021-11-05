import { RouterContext } from '@koa/router';
import { ErrorHandlerInterface, inject, injectable } from '@triptyk/nfw-core';
import { isHttpError } from 'http-errors';
import { LoggerService } from '../services/logger.service.js';

@injectable()
export class DefaultErrorHandler implements ErrorHandlerInterface {
  // eslint-disable-next-line no-useless-constructor
  constructor (@inject(LoggerService) private loggerService: LoggerService) {}

  async handle (error: any, context: RouterContext) {
    this.loggerService.logger.trace(error);
    if (isHttpError(error)) {
      context.response.status = error.statusCode;
      context.response.body = {
        message: error.message,
      }
    } else {
      context.response.status = 500;
      context.response.body = 'Internal server error';
    }
  }
}
