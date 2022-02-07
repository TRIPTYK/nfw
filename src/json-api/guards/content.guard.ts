import type { RouterContext } from '@koa/router';
import type { GuardInterface } from '@triptyk/nfw-core';
import { Args, Ctx, injectable } from '@triptyk/nfw-core';
import createHttpError from 'http-errors';

@injectable()
export class ContentGuard implements GuardInterface {
  /**
   * Why ignore argument ? There's a case where we need to upload files using multipart/form-data, unfortunately it breaks the spec, but it's for the better.
   */
  can (@Ctx() ctx: RouterContext, @Args() [forFileUpload]: [boolean] = [true]): boolean {
    const contentType = ctx.headers['content-type'];
    const accept = ctx.headers.accept;

    if (!contentType) return false;

    if (accept !== undefined && accept !== 'application/vnd.api+json') {
      throw createHttpError(406);
    }

    const hasMediaType = contentType.includes(';');

    if (!forFileUpload && hasMediaType) throw createHttpError(406);

    if (forFileUpload) {
      return true;
    }

    if (contentType !== 'application/vnd.api+json') {
      return false;
    }

    return true;
  }

  code = 415;
  message = 'Unsupported Media Type';
}
