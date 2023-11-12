import { container } from '@triptyk/nfw-core';
import { getConfiguration } from '../src/database/configuration.js';
import { ConfigurationServiceImpl } from '../src/services/configuration.service.js';
import type { ConfigurationService, Env } from '../src/services/configuration.service.js';

const configService = container.resolve<ConfigurationService<Env>>(ConfigurationServiceImpl);
configService.load();

export default getConfiguration(configService);
