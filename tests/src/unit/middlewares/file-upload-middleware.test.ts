import { vi, it, expect } from 'vitest';
import { BadRequestError } from '../../../../src/api/errors/web/bad-request';
import { fileUploadMiddleware } from '../../../../src/api/middlewares/file-upload.middleware';

let koaBody: typeof vi.fn;
vi.mock('koa-body', async () => {
  const func = vi.fn()
  return {
      get (): func
  };
});

it('is called with correct args', () => {
  const path = 'Wow, much path';
  const sizeInMb = 5
  fileUploadMiddleware(path, sizeInMb);
  expect(koaBody).toHaveBeenCalledWith({
    formidable: {
      uploadDir: path,
      multiples: false,
      keepExtensions: true,
      maxFileSize: sizeInMb * 1024 * 1024,
    },
    onError: (err) => {
      throw new BadRequestError(err.message);
    },
    multipart: true,
  })
})
