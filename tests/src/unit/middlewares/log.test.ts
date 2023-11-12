import 'reflect-metadata';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { LogMiddleware } from '../../../../src/middlewares/log.middleware.js';
import type { LoggerService } from '../../../../src/services/logger.service.js';

const loggerServiceMock = {
  error: vi.fn(),
  info: vi.fn(),
} satisfies LoggerService;
const next = vi.fn();

let middleware: LogMiddleware;

beforeEach(() => {
  middleware = new LogMiddleware(loggerServiceMock as never);
})

afterEach(() => {
  vi.clearAllMocks();
})

const anonymousContext = {
  state: {},
  ip: 'localhost',
  method: 'GET',
  url: '/foo',
  headers: {
    authorization: 'Auth_Bearer',
  },
} as any;

test('log service is called for logged-in user with context data', async () => {
  const loggedContext = {
    ...anonymousContext,
    state: {
      user: {
        id: 'id',
      },
    },
  } as any;

  await middleware.use(loggedContext, next);
  expect(loggerServiceMock.info).toBeCalledWith('GET', '/foo', 'id', 'localhost');
  expect(loggerServiceMock.info).toBeCalledTimes(1);
})

test('log service is called for anonymous user with context data', async () => {
  await middleware.use(anonymousContext, next);
  expect(loggerServiceMock.info).toBeCalledWith('GET', '/foo', 'anonymous', 'localhost');
  expect(loggerServiceMock.info).toBeCalledTimes(1);
})
