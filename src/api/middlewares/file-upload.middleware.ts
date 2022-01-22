import createHttpError from 'http-errors';
import koaBody from 'koa-body';

export const fileUploadMiddleware = koaBody({
  formidable: {
    uploadDir: './dist/uploads',
    multiples: false,
    keepExtensions: true,
    maxFileSize: 1 * 1024 * 1024, // 1MB
  },
  onError: (err) => {
    throw createHttpError(400, err.message);
  },
  multipart: true,
});
