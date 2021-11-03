import { RouterContext } from '@koa/router';
import { ErrorHandlerInterface } from '@triptyk/nfw-core';
import { isHttpError } from 'http-errors';

export class DefaultErrorHandler implements ErrorHandlerInterface {
  async handle (error: any, context: RouterContext) {
    if (isHttpError(error)) {
      context.response.status = error.statusCode;
      context.response.body = {
        message: error.message,
      }
    } else {
      console.error(error);
      context.response.status = 500;
      context.response.body = 'Internal server error';
    }
  }
}
