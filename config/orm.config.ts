import { container } from '@triptyk/nfw-core';
import type { ConfigurationService, Env } from '../src/api/services/configuration.service.js';
import { ConfigurationServiceImpl } from '../src/api/services/configuration.service.js';

const configService = container.resolve<ConfigurationService<Env>>(ConfigurationServiceImpl);
configService.load();

export default {
  host: configService.get('DATABASE_HOST'),
  entitiesTs: ['src/database/models'],
  entities: ['dist/src/database/models'],
  user: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASSWORD'),
  dbName: configService.get('DATABASE_NAME'),
  port: configService.get('DATABASE_PORT'),
  type: 'mysql',
  debug: configService.get('DEBUG')
};
