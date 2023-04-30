import type { Middleware } from '@koa/router';
import koaBody from 'koa-body';
import { BadRequestError } from '../errors/web/bad-request.js';

export const fileUploadMiddleware : Middleware = koaBody({
  formidable: {
    uploadDir: './dist/uploads',
    multiples: false,
    keepExtensions: true,
    maxFileSize: 1 * 1024 * 1024 // 1MB
  },
  onError: (err) => {
    throw new BadRequestError(err.message);
  },
  multipart: true
});
