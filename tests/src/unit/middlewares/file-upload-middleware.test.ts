import 'reflect-metadata';
import { vi, it, expect } from 'vitest';
import { createFileUploadMiddleware } from '../../../../src/api/middlewares/file-upload.middleware.js';
import * as KoaBody from 'koa-body';
import { createBadRequestError } from 'app/api/errors/web/bad-request.js';

vi.mock('koa-body', () => {
  return { __esModule: true, default: () => vi.fn() }
})

function instantiateDummyFileUploadMiddleware () {
  const path = 'Wow, much path';
  const sizeInMb = 5
  // eslint-disable-next-line new-cap
  const FileUploadMiddleware = createFileUploadMiddleware(path, sizeInMb);
  return new FileUploadMiddleware();
}

it('', async () => {
  const spiedKoaBody = vi.spyOn(KoaBody, 'default')
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
