import { EntityRepository } from '@mikro-orm/core'
import { Body, Controller, GET, injectable, InjectRepository, Param, UseGuard, UseMiddleware, UseResponseHandler } from '@triptyk/nfw-core'
import { AuthGuard } from '../guards/auth.guard.js'
import { createLogMiddleware } from '../middlewares/log.middleware.js'
import { UserModel } from '../models/user.model.js'
import { JsonResponsehandler } from '../response-handlers/json.response-handler.js'

@Controller('/users')
@injectable()
@UseResponseHandler(JsonResponsehandler)
@UseGuard(AuthGuard, true)
export class UserController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@InjectRepository(UserModel) private userRepository: EntityRepository<UserModel>) {}

  @GET('/list/:id')
  @UseMiddleware(createLogMiddleware(true))
  public async list (
    @Body() _body : unknown,
    @Param('id') _id: number
  ) {
    const allUsers = await this.userRepository.findAll();

    return allUsers;
  }
}
