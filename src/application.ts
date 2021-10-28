import { MikroORM } from '@mikro-orm/core'
import createApplication from '@triptyk/nfw-core'
import KoaRatelimit from 'koa-ratelimit';
import { AuthController } from './controllers/auth.controller.js';
import { UsersController } from './controllers/users.controller.js';
import { DefaultErrorHandler } from './error-handler/default.error-handler.js';
import { AuthGuard } from './guards/auth.guard.js';
import { NotFoundMiddleware } from './middlewares/not-found.middleware.js';
import { RefreshTokenModel } from './models/refresh-token.model.js';
import { UserModel } from './models/user.model.js';

(async () => {
  const orm = await MikroORM.init({
    entities: [UserModel, RefreshTokenModel],
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
    baseRoute: '/api/v1'
  });

  const port = 8001

  koaApp.listen(8001, () => {
    console.log(`Listening on port ${port}`)
  })
})()
