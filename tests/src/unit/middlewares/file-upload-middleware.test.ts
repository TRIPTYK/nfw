import 'reflect-metadata';
import { vi, it, expect, afterAll, vitest } from 'vitest';
import { createFileUploadMiddleware } from '../../../../src/middlewares/file-upload.middleware.js';
import * as KoaBody from 'koa-body';
import { createBadRequestError } from '../../../../src/errors/bad-request.js';

vi.mock('koa-body', () => ({
  koaBody: vi.fn(() => vi.fn())
}));

function instantiateDummyFileUploadMiddleware () {
  const path = 'Wow, much path';
  const sizeInMb = 5
  // eslint-disable-next-line new-cap
  const FileUploadMiddleware = createFileUploadMiddleware(path, sizeInMb);
  return new FileUploadMiddleware();
}

it('Calls koa-body with correct arguments', async () => {
  const spiedKoaBody = vi.spyOn(KoaBody, 'koaBody');
  const fileUploadMiddleware = instantiateDummyFileUploadMiddleware();
  await fileUploadMiddleware.use({
  } as never, vi.fn());
  expect(spiedKoaBody).toBeCalledWith(
    {
      formidable: {
        keepExtensions: true,
        maxFileSize: 5242880,
        multiples: false,
        uploadDir: 'Wow, much path',
      },
      multipart: true,
      onError: createBadRequestError,
    });
})

afterAll(() => {
  vitest.restoreAllMocks();
});
