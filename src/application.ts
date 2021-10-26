import { MikroORM } from '@mikro-orm/core'
import createApplication from '@triptyk/nfw-core'
import KoaRatelimit from 'koa-ratelimit';
import { UserController } from './controllers/user.controller.js'
import { DefaultErrorHandler } from './error-handler/default.error-handler.js';
import { AuthGuard } from './guards/auth.guard.js';
import { NotFoundMiddleware } from './middlewares/not-found.middleware.js';
import { UserModel } from './models/user.model.js';

(async () => {
  const orm = await MikroORM.init({
    entities: [UserModel],
    dbName: 'nfw',
    user: 'root',
    password: 'test123*',
    type: 'mysql'
  });

  // const generator = orm.getSchemaGenerator();

  // await generator.dropSchema();
  // await generator.createSchema();
  // await generator.updateSchema();

  const koaApp = await createApplication({
    controllers: [UserController],
    globalGuards: [{
      guard: AuthGuard,
      args: [false]
    }],
    globalMiddlewares: [
      KoaRatelimit({
        driver: 'memory',
        db: new Map(),
        duration: 5000,
        max: 2,
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

  const port = 8000

  koaApp.listen(8000, () => {
    console.log(`Listening on port ${port}`)
  })
})()
