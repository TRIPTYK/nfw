import { container } from '@triptyk/nfw-core';
import type { ConfigurationService, Env } from '../src/api/services/configuration.service.js';
import { getConfiguration } from '../src/database/configuration.js';
import { ConfigurationServiceImpl } from '../src/api/services/configuration.service.js';

const configService = container.resolve<ConfigurationService<Env>>(ConfigurationServiceImpl);
configService.load();

export default getConfiguration(configService);
