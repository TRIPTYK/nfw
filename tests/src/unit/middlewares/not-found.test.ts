import 'reflect-metadata';
import { expect, test } from 'vitest';
import { NotFoundMiddleware } from '../../../../src/api/middlewares/not-found.middleware.js';

test('Not found middleware sets context body', async () => {
  const currentUserMiddleware = new NotFoundMiddleware();
  const context = {} as any;
  await currentUserMiddleware.use(context);

  expect(context.body).toStrictEqual({ message: 'Not found', code: 404 });
})
