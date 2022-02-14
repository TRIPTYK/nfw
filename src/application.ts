import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import createApplication, { container } from '@triptyk/nfw-core';
import { AuthController } from './api/controllers/auth.controller.js';
import { UsersController } from './api/controllers/user.controller.js';
import { DefaultErrorHandler } from './api/error-handler/default.error-handler.js';
import { NotFoundMiddleware } from './api/middlewares/not-found.middleware.js';
import { RefreshTokenModel } from './api/models/refresh-token.model.js';
import { UserModel } from './api/models/user.model.js';
import KoaQS from 'koa-qs';
import { DocumentController } from './api/controllers/document.controller.js';
import type { Configuration } from './api/services/configuration.service.js';
import {
  ConfigurationService,
} from './api/services/configuration.service.js';
import { LogMiddleware } from './api/middlewares/log.middleware.js';
import { DocumentModel } from './api/models/document.model.js';
import { LoggerService } from './api/services/logger.service.js';
import cors from '@koa/cors';
import { CurrentUserMiddleware } from './api/middlewares/current-user.middleware.js';
import createHttpError from 'http-errors';
import { TestSeeder } from './database/seeder/test.seeder.js';
import type { SqlEntityManager } from '@mikro-orm/mysql';
import { createRateLimitMiddleware } from './api/middlewares/rate-limit.middleware.js';
import helmet from 'koa-helmet';
import koaBody from 'koa-body';
import Koa from 'koa';

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

  const orm = await MikroORM.init({
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
    await new TestSeeder().run(orm.em.fork() as SqlEntityManager);
  }

  const koaApp = await createApplication({
    server: new Koa(),
    controllers: [AuthController, UsersController, DocumentController],
    globalGuards: [],
    globalMiddlewares: [
      helmet(),
      cors({
        origin: corsConfig.origin,
      }),
      createRateLimitMiddleware(1000 * 60, 100, 'Too many requests'),
      koaBody({
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
      }),
      CurrentUserMiddleware,
      LogMiddleware,
    ],
    globalErrorhandler: DefaultErrorHandler,
    globalNotFoundMiddleware: NotFoundMiddleware,
    mikroORMConnection: orm,
    mikroORMContext: true,
    baseRoute: '/api/v1',
  });

  KoaQS(koaApp);

  const httpServer = koaApp.listen(port, () => {
    logger.logger.info(`Listening on port ${port}`);
  });

  return httpServer;
}
