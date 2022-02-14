import { container } from '@triptyk/nfw-core';
import { ConfigurationService } from './src/api/services/configuration.service.js';
import type { Configuration } from './src/api/services/configuration.service.js';

const { database } = await container.resolve(ConfigurationService).load() as Configuration;

export default {
  host: database.host,
  entitiesTs: ['src/api/models'],
  entities: ['dist/src/api/models'],
  user: database.user,
  password: database.password,
  dbName: database.database,
  port: database.port,
  type: database.type,
  debug: database.debug,
};
