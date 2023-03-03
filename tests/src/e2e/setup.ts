/* eslint-disable no-undef */
import { MikroORM } from '@mikro-orm/core';
import type { Server } from 'http';

let server : Server;

export async function setup () {
  const { runApplication } = await import('../../../src/application.js');
  server = await runApplication();
}

export async function teardown () {
  const { container } = await import('@triptyk/nfw-core');
  await new Promise((resolve) => server.close(resolve));
  await (container.resolve(MikroORM)).close(true);
}
