import type { RouterContext } from '@koa/router';
import { injectable } from '@triptyk/nfw-core';
import type { MiddlewareInterface } from '@triptyk/nfw-http';
import type { Next } from 'koa';
import koaBody from 'koa-body';
import type { Class } from 'type-fest';
import { createBadRequestError } from '../errors/web/bad-request.js';

export function createFileUploadMiddleware (path: string, maxFileSizeInMb: number = 1): Class<MiddlewareInterface> {
  @injectable()
  class FileUploadMiddleware implements MiddlewareInterface {
    async use (context: RouterContext, next: Next) {
      const uploadFileMiddleware = koaBody({
        formidable: {
          uploadDir: path,
          multiples: false,
          keepExtensions: true,
          maxFileSize: maxFileSizeInMb * 1024 * 1024, // 1024 * 1024 = 1Mb
        },
        onError: createBadRequestError,
        multipart: true,
      });
      return uploadFileMiddleware(context, next);
    }
  }

  return FileUploadMiddleware;
};
