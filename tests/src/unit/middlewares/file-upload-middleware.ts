import { vi, it, expect } from 'vitest';
import {fileUploadMiddleware} from '../../../../src/api/middlewares/file-upload.middleware';

const koaBody = vi.fn()
vi.mock('koa-body', async () => {
  return koaBody;
});

it('is called with correct args', () => {
  fileUploadMiddleware('Wow, much path', 5);
  expect(koaBody).toHaveBeenCalledWith();
})
