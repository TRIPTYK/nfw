import { MikroORM } from '@mikro-orm/core'
import createApplication, { container } from '@triptyk/nfw-core'
import KoaRatelimit from 'koa-ratelimit';
import { AuthController } from './api/controllers/auth.controller.js';
import { UsersController } from './api/controllers/users.controller.js';
import { DefaultErrorHandler } from './api/error-handler/default.error-handler.js';
import { NotFoundMiddleware } from './api/middlewares/not-found.middleware.js';
import { ArticleModel } from './api/models/article.model.js';
import { RefreshTokenModel } from './api/models/refresh-token.model.js';
import { UserModel } from './api/models/user.model.js';
import koaBody from 'koa-body'
import KoaQS from 'koa-qs';
import { ConfigurationService } from './api/services/configuration.service.js';
import { LogMiddleware } from './api/middlewares/log.middleware.js';

// import { UserFactory } from './database/factories/user.factory.js';
// import { ArticleFactory } from './database/factories/article.factory.js';
// import faker from 'faker';
(async () => {
  /**
   * Load the config service first
   */
  const { database, port } = await container.resolve<ConfigurationService>(ConfigurationService).load();

  const orm = await MikroORM.init({
    entities: [UserModel, RefreshTokenModel, ArticleModel],
    dbName: database.database,
    host: database.host,
    user: database.user,
    password: database.password,
    type: 'mysql',
    debug: true,
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
    controllers: [AuthController, UsersController],
    globalGuards: [],
    globalMiddlewares: [
      KoaRatelimit({ // first, the rate limit
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
    console.log(`Listening on port ${port}`)
  })
})()
