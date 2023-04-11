import createHttpError from 'http-errors';
import 'reflect-metadata';
import { expect, test, vi } from 'vitest';
import { DefaultErrorHandler } from '../../../../src/api/error-handler/default.error-handler.js';

const loggerService = {
  info: vi.fn(),
  error: vi.fn()
};

const configurationService = {
  get: vi.fn(),
  load: vi.fn()
};

const next = vi.fn();

const errorHandler = new DefaultErrorHandler(
  loggerService,
  configurationService
);

const context = {
  body: undefined,
  response: {
    status: undefined,
    body: undefined
  }
} as any;

test('It handles validation errors', async () => {
  next.mockRejectedValue([]);
  await errorHandler.use(context, next);
  expect(context.response.status).toStrictEqual(400);
  expect(context.response.body).toStrictEqual([]);
});

test('It handles fatal errors', async () => {
  next.mockRejectedValue(new Error('bip'));
  await errorHandler.use(context, next);
  expect(context.response.status).toStrictEqual(500);
  expect(context.response.body).toStrictEqual({
    code: 500,
    message: 'Internal server error'
  });
});

test('It handles http errors', async () => {
  next.mockRejectedValue(createHttpError(405));
  await errorHandler.use(context, next);
  expect(context.response.status).toStrictEqual(405);
  expect(context.response.body).toStrictEqual({
    message: 'Method Not Allowed'
  });
});
