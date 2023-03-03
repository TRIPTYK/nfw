/* eslint-disable no-undef */
import type { Application } from '../../../src/application.js';

let server : Application;

export async function setup () {
  const { Application } = await import('../../../src/application.js');
  server = new Application();
  await server.start();
}

export async function teardown () {
  await server.stop();
}
