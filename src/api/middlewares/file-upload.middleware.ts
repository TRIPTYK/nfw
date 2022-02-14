import type { Middleware } from '@koa/router';
import createHttpError from 'http-errors';
import koaBody from 'koa-body';

export const fileUploadMiddleware : Middleware = koaBody({
  formidable: {
    uploadDir: './dist/uploads',
    multiples: false,
    keepExtensions: true,
    // Can't handle directly in koa body
    // onFileBegin: (_formName, file: formidable.File) => {
    //   if (!Object.values(MimeTypes).includes((file.type ?? '') as MimeTypes)) {
    //     throw createHttpError(422);
    //   }
    // },
    maxFileSize: 1 * 1024 * 1024, // 1MB
  },
  onError: (err) => {
    throw createHttpError(400, err.message);
  },
  multipart: true,
});
