import { RouterContext } from '@koa/router';
import { MiddlewareInterface } from '@triptyk/nfw-core';

export class NotFoundMiddleware implements MiddlewareInterface {
  async use (context: RouterContext) {
    context.body = {
      message: 'Not found',
      code: 404,
    };
  }
}
