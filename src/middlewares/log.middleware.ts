import { RouterContext } from '@koa/router'
import { MiddlewareInteface } from '@triptyk/nfw-core'
import { Next } from 'koa'

export function createLogMiddleware (isIp: boolean) {
  return class LogMiddleware implements MiddlewareInteface {
    async use (context: RouterContext, next: Next) {
      console.log('pass', context.ip, 'into', context.origin, isIp)
      await next();
    }
  }
}
