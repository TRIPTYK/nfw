import { container } from '@triptyk/nfw-core';
import type { Middleware } from 'koa';
import KoaRatelimit from 'koa-ratelimit';
import { ConfigurationServiceImpl } from '../services/configuration.service.js';

export const createRateLimitMiddleware : (duration: number, max: number, message?: string) => Middleware = (duration: number, max: number, message?: string) => {
  const configurationService = container.resolve(ConfigurationServiceImpl);
  if (configurationService.get('NODE_ENV') === 'test') max = Infinity;

  return KoaRatelimit({
    driver: 'memory',
    db: new Map(),
    duration,
    max,
    throw: true,
    errorMessage: message ?? 'Too many requests',
    id: (ctx) => ctx.ip
  });
}
