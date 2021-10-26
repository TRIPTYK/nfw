import { RouterContext } from '@koa/router';
import { ErrorHandlerInterface } from '@triptyk/nfw-core';

export class RouteErrorHandler implements ErrorHandlerInterface {
  async handle (_error: any, context: RouterContext) {
    context.response.body = 'route';
  }
}
