import { MikroORM } from '@mikro-orm/core'
import createApplication from '@triptyk/nfw-core'
import KoaRatelimit from 'koa-ratelimit';
import { AuthController } from './api/controllers/auth.controller.js';
import { UsersController } from './api/controllers/users.controller.js';
import { DefaultErrorHandler } from './api/error-handler/default.error-handler.js';
import { AuthGuard } from './api/guards/auth.guard.js';
import { NotFoundMiddleware } from './api/middlewares/not-found.middleware.js';
import { ArticleModel } from './api/models/article.model.js';
import { RefreshTokenModel } from './api/models/refresh-token.model.js';
import { UserModel } from './api/models/user.model.js';

(async () => {
  const orm = await MikroORM.init({
    entities: [UserModel, RefreshTokenModel, ArticleModel],
    dbName: 'nfw',
    user: 'root',
    password: 'test123*',
    type: 'mysql'
  });

  const generator = orm.getSchemaGenerator();

  // await generator.dropSchema();
  // await generator.createSchema();
  await generator.updateSchema();

  const koaApp = await createApplication({
    controllers: [AuthController, UsersController],
    globalGuards: [{
      guard: AuthGuard,
      args: [true]
    }],
    globalMiddlewares: [

      KoaRatelimit({
        driver: 'memory',
        db: new Map(),
        duration: 5000,
        max: 5,
        throw: true,
        errorMessage: 'Sometimes You Just Have to Slow Down.',
        id: (ctx) => ctx.ip
      })
    ],
    globalErrorhandler: DefaultErrorHandler,
    globalNotFoundMiddleware: NotFoundMiddleware,
    mikroORMConnection: orm,
    mikroORMContext: true,
    baseRoute: '/api/v1'
  });

  const port = 8000

  koaApp.listen(8000, () => {
    console.log(`Listening on port ${port}`)
  })
})()
