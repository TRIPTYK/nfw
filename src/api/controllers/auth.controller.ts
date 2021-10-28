import { EntityRepository } from '@mikro-orm/core'
import { Body, Controller, GET, injectable, InjectRepository } from '@triptyk/nfw-core'
import { UserModel } from '../models/user.model.js';

@Controller('/auth')
@injectable()
export class AuthController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@InjectRepository(UserModel) private userRepository: EntityRepository<UserModel>) {}

  @GET('/register')
  public async register (
    @Body() body : UserModel
  ) {
    const allUsers = this.userRepository.create(body);

    return allUsers;
  }

  @GET('/login')
  public async login () {
    return 'login'
  }

  @GET('/refresh-token')
  public async refreshToken () {
    return 'refresh';
  }
}
