import type { MikroORM } from '@mikro-orm/core';
import { RequestContext } from '@mikro-orm/core';
import { test } from 'vitest';

export function testCtx (testName: string, orm: () => MikroORM, fnc: () => Promise<unknown>) {
  return test(testName, () => RequestContext.createAsync(orm().em.fork(), fnc));
}
