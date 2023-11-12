import type { Seeder } from '@mikro-orm/seeder';
import { container } from '@triptyk/nfw-core';
import type { Constructor } from 'type-fest';
import { Application } from '../../src/application.js';
import { DatabaseConnectionImpl } from '../../src/database/connection.js';

export async function setupIntegrationTest (...seed: Constructor<Seeder>[]) {
  const application = container.resolve(Application);
  await application.setup();
  const orm = container.resolve(DatabaseConnectionImpl);
  await orm.connection.getSchemaGenerator().clearDatabase();
  await orm.connection.getSeeder().seed(...seed);
  return application;
}

export async function teardownIntegrationTest (application: Application) {
  await application.stop();
}
