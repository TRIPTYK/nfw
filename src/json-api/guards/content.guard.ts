import type { RouterContext } from '@koa/router';
import type { GuardInterface } from '@triptyk/nfw-core';
import { Ctx, injectable } from '@triptyk/nfw-core';
import createHttpError from 'http-errors';

@injectable()
export class ContentGuard implements GuardInterface {
  can (@Ctx() ctx: RouterContext): boolean {
    const contentType = ctx.headers['content-type'];
    const accept = ctx.headers.accept;

    if (!contentType) return false;

    if (accept !== undefined && accept !== 'application/vnd.api+json') {
      throw createHttpError(406);
    }

    const hasMediaType = contentType.includes(';');

    if (hasMediaType) throw createHttpError(406);

    if (contentType !== 'application/vnd.api+json') {
      return false;
    }

    return true;
  }

  code = 415;
  message = 'Unsupported Media Type';
}
