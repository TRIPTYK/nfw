import type { Middleware } from '@koa/router';
import koaBody from 'koa-body';
import { BadRequestError } from '../errors/web/bad-request.js';

export const fileUploadMiddleware : (path: string, maxFileSizeInMb?: number) => Middleware = (path: string, maxFileSizeInMb: number = 1) => koaBody({
  formidable: {
    uploadDir: path,
    multiples: false,
    keepExtensions: true,
    maxFileSize: maxFileSizeInMb * 1024 * 1024, // 1024 + 1024 = 1Mb
  },
  onError: (err) => {
    throw new BadRequestError(err.message);
  },
  multipart: true,
});
