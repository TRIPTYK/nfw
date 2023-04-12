import type { Options } from '@mikro-orm/core';
import type { ConfigurationService, Env } from '../api/services/configuration.service.js';

export function getConfiguration (configurationService: ConfigurationService<Env>) {
  return {
    seeder: {
      path: 'src/database/seeders/' + configurationService.get('NODE_ENV')
    },
    migrations: {
      snapshot: false,
      path: 'src/database/migrations/' + configurationService.get('NODE_ENV')
    },
    entities: ['src/database/models'],
    dbName: configurationService.get('DATABASE_NAME'),
    host: configurationService.get('DATABASE_HOST'),
    port: configurationService.get('DATABASE_PORT'),
    user: configurationService.get('DATABASE_USER'),
    password: configurationService.get('DATABASE_PASSWORD'),
    type: configurationService.get('DATABASE_TYPE'),
    debug: configurationService.get('DEBUG')
  } satisfies Options;
}
