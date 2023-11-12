import KoaRatelimit from 'koa-ratelimit';
import 'reflect-metadata';
import { afterEach, expect, test, vi } from 'vitest';
import { createRateLimitMiddleware } from '../../../../src/middlewares/rate-limit.middleware.js';

const configService = {
  get: vi.fn(),
}

vi.mock('@triptyk/nfw-core', async () => {
  const existingImport: any = await vi.importActual('@triptyk/nfw-core');
  return {
    ...existingImport,
    container: {
      resolve: vi.fn(() => configService),
    },
  }
});

vi.mock('koa-ratelimit', () => {
  return { default: vi.fn() }
})

afterEach(() => {
  vi.restoreAllMocks();
})

function instantiateMiddlewareAndReturnCall () {
  const middlewareClass = createRateLimitMiddleware(10, 10);
  // eslint-disable-next-line no-new, new-cap
  new middlewareClass(configService as never);
  return (KoaRatelimit as any).mock.calls[0] as any[];
}

test('Unlimited in test env', async () => {
  configService.get.mockReturnValue('test');
  expect(instantiateMiddlewareAndReturnCall()[0].max).toBe(Infinity);
});

test('max is taken from argument in other envs', async () => {
  configService.get.mockReturnValue('development');
  expect(instantiateMiddlewareAndReturnCall()[0].max).toBe(10);
});
