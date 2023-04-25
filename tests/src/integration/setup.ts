import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import { Application } from '../../../src/application.js';
import { DatabaseConnectionImpl } from '../../../src/database/connection.js';

let application : Application;

export async function setup () {
  application = container.resolve(Application);
  await application.setup();
  const orm = container.resolve(DatabaseConnectionImpl).connection;
  await orm.getSchemaGenerator().dropSchema({
    dropMigrationsTable: true,
    dropDb: false
  });
  await orm.getMigrator().up();
}

export async function teardown () {
  await application.stop();
}
