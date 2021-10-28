import { RouterContext } from '@koa/router'
import { MiddlewareInterface } from '@triptyk/nfw-core'

export class NotFoundMiddleware implements MiddlewareInterface {
  async use (context: RouterContext) {
    context.body = 'Not found maman';
  }
}
