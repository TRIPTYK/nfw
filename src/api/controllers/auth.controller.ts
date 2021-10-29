import { EntityRepository } from '@mikro-orm/core'
import { Body, Controller, GET, inject, injectable, InjectRepository, POST } from '@triptyk/nfw-core'
import { UserModel } from '../models/user.model.js';
import { AclService } from '../services/acl.service.js';

@Controller('/auth')
@injectable()
export class AuthController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@InjectRepository(UserModel) private userRepository: EntityRepository<UserModel>, @inject(AclService) private aclService: AclService) {}

  @POST('/register')
  public async register (
    @Body() body : UserModel
  ) {
    console.log(body);
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
