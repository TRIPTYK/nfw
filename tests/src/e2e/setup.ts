import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import { Application } from '../../../src/application.js';

let application : Application;

export async function setup () {
  application = container.resolve(Application);
  await application.setup();
  await application.listen();
}

export async function teardown () {
  await application.stop();
}
