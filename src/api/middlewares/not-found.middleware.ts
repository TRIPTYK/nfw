import type { RouterContext } from '@koa/router';
import type { MiddlewareInterface } from '@triptyk/nfw-core';

export class NotFoundMiddleware implements MiddlewareInterface {
  async use (context: RouterContext) {
    context.body = {
      message: 'Not found',
      code: 404,
    };
  }
}
