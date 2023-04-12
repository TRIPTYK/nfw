import type { MikroORM } from '@mikro-orm/mysql';
import { inject, singleton } from '@triptyk/nfw-core';
import type { ConfigurationService, Env } from '../api/services/configuration.service.js';
import { ConfigurationServiceImpl } from '../api/services/configuration.service.js';
import type { DatabaseConnection } from './connection.js';
import { DatabaseConnectionImpl } from './connection.js';

@singleton()
export class DatabaseGenerator {
  public constructor (
    @inject(DatabaseConnectionImpl) private database: DatabaseConnection<MikroORM>,
    @inject(ConfigurationServiceImpl) private configurationService: ConfigurationService<Env>
  ) {}

  public async generateDatabase () {
    const shouldRefresh = this.configurationService.get('REFRESH_DATABASE');
    const generator = this.database.connection.getSchemaGenerator();

    if (shouldRefresh) {
      await generator.refreshDatabase();
    }

    await this.database.connection.getSeeder().seedString('DatabaseSeeder');
  }
}
