import 'reflect-metadata';
import { expect, test, vi } from 'vitest';
import { ValidationError } from 'yup';
import { DefaultErrorHandler } from '../../../../src/error-handler/default.error-handler.js';
import { WebError } from '../../../../src/errors/web-error.js';

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
  next.mockRejectedValue(new ValidationError([]));
  await errorHandler.use(context, next);
  expect(context.status).toStrictEqual(400);
  expect(context.body).toStrictEqual([]);
});

test('It prints fatal error details in development', async () => {
  configurationService.get.mockReturnValue(false);
  next.mockRejectedValue(new Error('bip'));
  await errorHandler.use(context, next);
  expect(context.status).toStrictEqual(500);
  expect(context.body).toStrictEqual({
    message: 'bip'
  });
});

test('It hides fatal error details in production', async () => {
  configurationService.get.mockReturnValue(true);
  next.mockRejectedValue(new Error('bip'));
  await errorHandler.use(context, next);
  expect(context.status).toStrictEqual(500);
  expect(context.body).toStrictEqual({
    message: 'Internal server error'
  });
});

test('It handles webError errors', async () => {
  const error = new WebError('Method Not Allowed');
  error.status = 415;
  next.mockRejectedValue(error);
  await errorHandler.use(context, next);
  expect(context.status).toStrictEqual(415);
  expect(context.body).toStrictEqual({
    message: 'Method Not Allowed'
  });
});
