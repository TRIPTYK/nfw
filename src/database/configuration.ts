import type { Options } from '@mikro-orm/core';
import type { ConfigurationService, Env } from '../services/configuration.service.js';

export function getConfiguration (configurationService: ConfigurationService<Env>) {
  return {
    seeder: {
      path: 'src/database/seeders/' + configurationService.get('NODE_ENV'),
      pathTs: 'src/database/seeders/' + configurationService.get('NODE_ENV')
    },
    migrations: {
      snapshot: false,
      path: 'src/database/migrations/'
    },
    entities: ['src/**/*.model.ts'],
    dynamicImportProvider: id => import(id),
    dbName: configurationService.get('DATABASE_NAME'),
    host: configurationService.get('DATABASE_HOST'),
    port: configurationService.get('DATABASE_PORT'),
    user: configurationService.get('DATABASE_USER'),
    password: configurationService.get('DATABASE_PASSWORD'),
    type: configurationService.get('DATABASE_TYPE'),
    debug: configurationService.get('DEBUG')
  } satisfies Options;
}
