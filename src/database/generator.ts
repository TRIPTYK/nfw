import type { MikroORM } from '@mikro-orm/mysql';
import { inject, singleton } from '@triptyk/nfw-core';
import type { LoggerService } from '../api/services/logger.service.js';
import { LoggerServiceImpl } from '../api/services/logger.service.js';
import type { DatabaseConnection } from './connection.js';
import { DatabaseConnectionImpl } from './connection.js';

@singleton()
export class DatabaseGenerator {
  public constructor (
    @inject(DatabaseConnectionImpl) private database: DatabaseConnection<MikroORM>,
    @inject(LoggerServiceImpl) private logger: LoggerService
  ) {}

  public async generateDatabase () {
    const migrator = this.database.connection.getMigrator();
    const generator = this.database.connection.getSchemaGenerator();

    this.logger.info('Migrating fresh database');
    await generator.dropSchema({
      dropMigrationsTable: true
    });
    await migrator.up();
    this.logger.info('Seeding default seeder');
    await this.database.connection.getSeeder().seedString('DatabaseSeeder');
  }
}
