import { RouterContext } from '@koa/router'
import { MiddlewareInteface } from '@triptyk/nfw-core'

export class NotFoundMiddleware implements MiddlewareInteface {
  async use (context: RouterContext, next) {
    context.body = 'Not found maman';
  }
}
