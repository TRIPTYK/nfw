import { LoadStrategy } from '@mikro-orm/core';
import createApplication, { container } from '@triptyk/nfw-core';
import { RefreshTokenModel } from './api/models/refresh-token.model.js';
import { UserModel } from './api/models/user.model.js';
import KoaQS from 'koa-qs';
import type { Configuration } from './api/services/configuration.service.js';
import {
  ConfigurationService,
} from './api/services/configuration.service.js';
import { DocumentModel } from './api/models/document.model.js';
import { LoggerService } from './api/services/logger.service.js';
import createHttpError from 'http-errors';
import { TestSeeder } from './database/seeder/test.seeder.js';
import Koa from 'koa';
import { DevelopmentSeeder } from './database/seeder/development.seeder.js';
import { MainArea } from './api/areas/main.area.js';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import { createRateLimitMiddleware } from './api/middlewares/rate-limit.middleware.js';
import koaBody from 'koa-body';
import { init, requestContext } from '@triptyk/nfw-mikro-orm';
import { JsonApiRegistry } from '@triptyk/nfw-jsonapi';

export async function runApplication () {
  /**
   * Load the config service first
   */
  const {
    database,
    port,
    cors: corsConfig,
    env,
  } = await container
    .resolve<ConfigurationService<Configuration>>(ConfigurationService)
    .load();
  const logger = container.resolve(LoggerService);

  const orm = await init({
    entities: [UserModel, RefreshTokenModel, DocumentModel],
    dbName: database.database,
    host: database.host,
    port: database.port,
    user: database.user,
    password: database.password,
    type: database.type,
    loadStrategy: LoadStrategy.SELECT_IN,
    debug: database.debug,
    findOneOrFailHandler: (_entityName: string) => {
      return createHttpError(404, 'Not found');
    },
  });

  const isConnected = await orm.isConnected();

  if (!isConnected) {
    throw new Error('Failed to connect to database');
  }

  if (env === 'test' || env === 'development') {
    const generator = orm.getSchemaGenerator();
    await generator.dropSchema();
    await generator.createSchema();
    await generator.updateSchema();
  }

  if (env === 'test') {
    await new TestSeeder().run(orm.em.fork());
  }

  if (env === 'development') {
    await new DevelopmentSeeder().run(orm.em.fork());
  }

  const server = new Koa();

  server.use(requestContext);
  server.use(helmet());
  server.use(cors({
    origin: corsConfig.origin,
  }));
  server.use(createRateLimitMiddleware(1000 * 60, 100, 'Too many requests'));
  server.use(koaBody({
    jsonLimit: '128kb',
    text: false,
    multipart: false,
    urlencoded: false,
    onError: (err: Error) => {
      if (err.name === 'PayloadTooLargeError') {
        throw createHttpError(413, err.message);
      }
      throw createHttpError(400, err.message);
    },
  }));

  container.resolve(JsonApiRegistry).init({
    apiPath: '/api/v1',
  });

  const koaApp = await createApplication({
    server,
    controllers: [MainArea],
  });

  KoaQS(koaApp);

  const httpServer = koaApp.listen(port, () => {
    logger.logger.info(`Listening on port ${port}`);
  });

  return httpServer;
}
