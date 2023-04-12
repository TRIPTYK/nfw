import type { RouterContext } from '@koa/router';
import { inject, injectable } from '@triptyk/nfw-core';
import type { MiddlewareInterface } from '@triptyk/nfw-http';
import type { Middleware, Next } from 'koa';
import KoaRatelimit from 'koa-ratelimit';
import type { ConfigurationService, Env } from '../services/configuration.service.js';
import { ConfigurationServiceImpl } from '../services/configuration.service.js';

export function createRateLimitMiddleware (duration: number, max: number, message?: string) {
  @injectable()
  class RateLimitMiddleware implements MiddlewareInterface {
    public rate: Middleware;

    public constructor (
      @inject(ConfigurationServiceImpl) public configurationService: ConfigurationService<Env>
    ) {
      this.rate = KoaRatelimit({
        driver: 'memory',
        db: new Map(),
        duration,
        max: this.configurationService.get('NODE_ENV') === 'test'  ? Infinity : max,
        throw: true,
        errorMessage: message ?? 'Too many requests',
        id: (ctx) => ctx.ip
      })
    }

    async use (context: RouterContext, next: Next): Promise<void> {
      await this.rate(context, next);
    }
  };

  return RateLimitMiddleware;
}
