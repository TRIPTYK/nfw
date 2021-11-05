import { MikroORM } from '@mikro-orm/core';
import createApplication, { container } from '@triptyk/nfw-core';
import KoaRatelimit from 'koa-ratelimit';
import { AuthController } from './api/controllers/auth.controller.js';
import { UsersController } from './api/controllers/users.controller.js';
import { DefaultErrorHandler } from './api/error-handler/default.error-handler.js';
import { NotFoundMiddleware } from './api/middlewares/not-found.middleware.js';
import { ArticleModel } from './api/models/article.model.js';
import { RefreshTokenModel } from './api/models/refresh-token.model.js';
import { UserModel } from './api/models/user.model.js';
import koaBody from 'koa-body';
import KoaQS from 'koa-qs';
import { DocumentController } from './api/controllers/documents.controller.js';
import { ConfigurationService } from './api/services/configuration.service.js';
import { LogMiddleware } from './api/middlewares/log.middleware.js';
<<<<<<< HEAD
import { DocumentModel } from './api/models/document.model.js';
=======
import { LoggerService } from './api/services/logger.service.js';
>>>>>>> 4ab1720736d0f51050c52efbcbbc647d07984641

// import { UserFactory } from './database/factories/user.factory.js';
// import { ArticleFactory } from './database/factories/article.factory.js';
// import faker from 'faker';

(async () => {
  /**
   * Load the config service first
   */
<<<<<<< HEAD
  const { database, port } = await container
    .resolve<ConfigurationService>(ConfigurationService)
    .load();
=======
  const { database, port } = await container.resolve<ConfigurationService>(ConfigurationService).load();
  const logger = container.resolve(LoggerService);
>>>>>>> 4ab1720736d0f51050c52efbcbbc647d07984641

  const orm = await MikroORM.init({
    entities: [UserModel, RefreshTokenModel, ArticleModel, DocumentModel],
    dbName: database.database,
    host: database.host,
    user: database.user,
    password: database.password,
    type: 'mysql',
    debug: database.debug,
  });

  const generator = orm.getSchemaGenerator();

  // await generator.dropSchema();
  // await generator.createSchema();
  await generator.updateSchema();

  // const users = await new UserFactory(orm.em).create(100);
  // const articles = new ArticleFactory(orm.em).make(1000)

  // articles.forEach((article) => {
  //   article.owner = faker.random.arrayElement(users)
  // // });

  // await orm.em.persistAndFlush(articles);

  const koaApp = await createApplication({
    controllers: [AuthController, UsersController, DocumentController],
    globalGuards: [],
    globalMiddlewares: [
      koaBody({
        formidable: {
          uploadDir: './dist/uploads',
          multiples: true,
          keepExtensions: true,
          onFileBegin: (name, file) => {
            const dir = './dist/uploads';
            let filename = file.name.split('.');
            file.originalName = file.name;
            filename = `${filename.slice(0, -1).join('.')}-${Date.now()}.${
              filename[filename.length - 1]
            }`;
            file.name = filename;
            file.path = `${dir}/${filename}`;
          },
        },
        multipart: true,
        urlencoded: true,
      }),
      KoaRatelimit({
        // first, the rate limit
        driver: 'memory',
        db: new Map(),
        duration: 10000,
        max: 25,
        throw: true,
        errorMessage: 'Sometimes You Just Have to Slow Down.',
        id: (ctx) => ctx.ip,
      }),
      koaBody(),
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
<<<<<<< HEAD
    console.log(`Listening on port ${port}`);
  });
})();
=======
    logger.logger.info(`Listening on port ${port}`)
  })
})()
>>>>>>> 4ab1720736d0f51050c52efbcbbc647d07984641
