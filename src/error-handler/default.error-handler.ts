import { RouterContext } from '@koa/router';
import { ErrorHandlerInterface } from '@triptyk/nfw-core';

export class DefaultErrorHandler implements ErrorHandlerInterface {
  async handle (error: any, context: RouterContext) {
    context.response.body = {
      message: error.message
    }
  }
}
