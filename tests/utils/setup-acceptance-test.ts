import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import { Application } from '../../src/application.js';
import { DatabaseConnectionImpl } from '../../src/database/connection.js';
import { DatabaseSeeder } from '../../src/database/seeders/test/test.seeder.js';

export async function setupAcceptance () {
  const application = container.resolve(Application);
  await application.setup();
  const orm = container.resolve(DatabaseConnectionImpl);
  await orm.connection.getSchemaGenerator().clearDatabase();
  await orm.connection.getSeeder().seed(DatabaseSeeder);
  await application.listen();
  return application;
}

export async function teardownAcceptance (application: Application) {
  await application.stop();
}
