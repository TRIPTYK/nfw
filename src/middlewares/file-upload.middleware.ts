import type { RouterContext } from '@koa/router';
import { injectable } from '@triptyk/nfw-core';
import type { MiddlewareInterface } from '@triptyk/nfw-http';
import type { Middleware, Next } from 'koa';
import { koaBody } from 'koa-body';
import type { Class } from 'type-fest';
import { createBadRequestError } from '../errors/bad-request.js';

export function createFileUploadMiddleware (path: string, maxFileSizeInMb: number = 1): Class<MiddlewareInterface> {
  @injectable()
  class FileUploadMiddleware implements MiddlewareInterface {
    public fileUploadMiddleware: Middleware;

    public constructor (
    ) {
      this.fileUploadMiddleware = koaBody({
        formidable: {
          uploadDir: path,
          multiples: false,
          keepExtensions: true,
          maxFileSize: maxFileSizeInMb * 1024 * 1024, // 1024 * 1024 = 1Mb
        },
        onError: createBadRequestError,
        multipart: true,
      });
    }

    async use (context: RouterContext, next: Next) {
      try {
        await this.fileUploadMiddleware(context, next);
      } catch (e) {
        if (e instanceof Error && e.name === 'TooManyRequestsError') {
          throw new Error('Wesh');
        }
        throw e;
      }
    }
  }

  return FileUploadMiddleware;
};
