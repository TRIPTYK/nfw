import KoaRatelimit from 'koa-ratelimit';
import 'reflect-metadata';
import { afterEach, expect, test, vi } from 'vitest';
import { createRateLimitMiddleware } from '../../../../src/api/middlewares/rate-limit.middleware.js';

const configService = {
  get: vi.fn()
}

vi.mock('@triptyk/nfw-core', async () => {
  return {
    injectable: vi.fn(),
    singleton: vi.fn(),
    container: {
      resolve: vi.fn(() => configService)
    }
  }
});

vi.mock('koa-ratelimit', () => {
  return { default: vi.fn() }
})

afterEach(() => {
  vi.restoreAllMocks();
})

test('Unlimited in test env', async () => {
  configService.get.mockReturnValue('test');
  createRateLimitMiddleware(10, 10);
  const [rateLimitParameters] = (KoaRatelimit as any).mock.calls[0];
  expect(rateLimitParameters.max).toBe(Infinity);
});

test('max is taken from argument in other envs', async () => {
  configService.get.mockReturnValue('development');
  createRateLimitMiddleware(10, 10);
  const [rateLimitParameters] = (KoaRatelimit as any).mock.calls[0];
  expect(rateLimitParameters.max).toBe(10);
});
