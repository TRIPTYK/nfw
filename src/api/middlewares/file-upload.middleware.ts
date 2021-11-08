import { RouterContext } from '@koa/router'
import { injectable, MiddlewareInterface } from '@triptyk/nfw-core'

@injectable()
export class FileUploadMiddleware implements MiddlewareInterface {
  async use (
    context: RouterContext,
    next: any,
  ) {
    await next();
  }
}
