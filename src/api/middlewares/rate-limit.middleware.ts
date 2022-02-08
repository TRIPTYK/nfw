import type { Middleware } from 'koa';
import KoaRatelimit from 'koa-ratelimit';

export const createRateLimitMiddleware : (duration: number, max: number, message?: string) => Middleware = (duration: number, max: number, message?: string) => KoaRatelimit({
  driver: 'memory',
  db: new Map(),
  duration,
  max,
  throw: true,
  errorMessage: message ?? 'Too many requests',
  id: (ctx) => ctx.ip,
});
