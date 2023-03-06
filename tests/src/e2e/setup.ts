import { Application } from '../../../src/application.js';

let application : Application;

export async function setup () {
  application = new Application();
  await application.setup();
  await application.listen();
}

export async function teardown () {
  await application.stop();
}
