import { EntityRepository } from '@mikro-orm/core'
import { Body, Controller, GET, injectable, InjectRepository, Param, UseErrorHandler, UseGuard, UseMiddleware, UseResponseHandler } from '@triptyk/nfw-core'
import KoaRatelimit from 'koa-ratelimit'
import { DefaultErrorHandler } from '../error-handler/default.error-handler.js'
import { RouteErrorHandler } from '../error-handler/route.error-handler.js'
import { AuthGuard } from '../guards/auth.guard.js'
import { createLogMiddleware } from '../middlewares/log.middleware.js'
import { UserModel } from '../models/user.model.js'
import { JsonResponsehandler } from '../response-handlers/json.response-handler.js'

@Controller('/users')
@UseMiddleware(KoaRatelimit({
  driver: 'memory',
  db: new Map(),
  duration: 5000,
  max: 2,
  throw: true,
  errorMessage: 'Sometimes You Just Have to Slow Down.',
  id: (ctx) => ctx.ip
}))
@UseErrorHandler(DefaultErrorHandler)
@injectable()
@UseGuard(AuthGuard, true)
export class UserController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@InjectRepository(UserModel) private userRepository: EntityRepository<UserModel>) {}

    @GET('/list/:id')
    @UseMiddleware(createLogMiddleware(true))
    @UseErrorHandler(RouteErrorHandler)
    @UseResponseHandler(JsonResponsehandler)
  public async list (
    @Body() _body : unknown,
    @Param('id') _id: number
  ) {
    const allUsers = await this.userRepository.findAll();

    return allUsers;
  }
}
