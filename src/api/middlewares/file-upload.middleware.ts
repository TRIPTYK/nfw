import koaBody from 'koa-body';

export const fileUploadMiddleware = koaBody({
  formidable: {
    uploadDir: './dist/uploads',
    multiples: false,
    keepExtensions: true,
    maxFileSize: 1 * 1024 * 1024, // 1MB
  },
  multipart: true,
});
