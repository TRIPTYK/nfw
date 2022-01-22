import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import createApplication, { container } from '@triptyk/nfw-core';
import KoaRatelimit from 'koa-ratelimit';
import { AuthController } from './api/controllers/auth.controller.js';
import { UsersController } from './api/controllers/users.controller.js';
import { DefaultErrorHandler } from './api/error-handler/default.error-handler.js';
import { NotFoundMiddleware } from './api/middlewares/not-found.middleware.js';
import { RefreshTokenModel } from './api/models/refresh-token.model.js';
import { UserModel } from './api/models/user.model.js';
import KoaQS from 'koa-qs';
import { DocumentController } from './api/controllers/documents.controller.js';
import { ConfigurationService } from './api/services/configuration.service.js';
import { LogMiddleware } from './api/middlewares/log.middleware.js';
import { DocumentModel } from './api/models/document.model.js';
import { LoggerService } from './api/services/logger.service.js';
import cors from '@koa/cors';
import { CurrentUserMiddleware } from './api/middlewares/current-user.middleware.js';
import createHttpError from 'http-errors';
import koaBody from 'koa-body';

(async () => {
  /**
   * Load the config service first
   */
  const { database, port, cors: corsConfig } = await container
    .resolve<ConfigurationService>(ConfigurationService)
    .load();
  const logger = container.resolve(LoggerService);

  const orm = await MikroORM.init({
    entities: [UserModel, RefreshTokenModel, DocumentModel],
    dbName: database.database,
    host: database.host,
    user: database.user,
    password: database.password,
    type: 'mysql',
    loadStrategy: LoadStrategy.SELECT_IN,
    debug: database.debug,
    findOneOrFailHandler: (_entityName: string) => {
      return createHttpError(404, 'Not found');
    },
  });

  const koaApp = await createApplication({
    controllers: [AuthController, UsersController, DocumentController],
    globalGuards: [],
    globalMiddlewares: [
      cors({
        origin: corsConfig.origin,
      }),
      KoaRatelimit({
        driver: 'memory',
        db: new Map(),
        duration: 10000,
        max: 25,
        throw: true,
        errorMessage: 'Sometimes You Just Have to Slow Down.',
        id: (ctx) => ctx.ip,
      }),
      koaBody({
        onError: (err) => {
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

  koaApp.listen(port, () => {
    logger.logger.info(`Listening on port ${port}`);
  });
})();
