/* eslint-disable no-undef */
import type { MikroORM } from '@mikro-orm/core';
import type { Server } from 'http';

let server : Server;

global.beforeEach(async () => {
  const { runApplication } = await import('../src/application.js');
  server = await runApplication();
});

global.afterEach(async () => {
  const { container, databaseInjectionToken } = await import('@triptyk/nfw-core');
  await new Promise((resolve, _reject) => server.close(resolve));
  // close existing database connection
  await (container.resolve(databaseInjectionToken) as MikroORM).close(true);
});
