import { Controller, DELETE, GET, inject, injectable, InjectRepository, PATCH, POST } from '@triptyk/nfw-core'
import { JsonApiQueryParams } from '../decorators/json-api-params.js';
import { UserModel } from '../models/user.model.js';
import { UserRepository } from '../repositories/user.repository.js';
import {ConfigurationService} from '../services/configuration.service.js';

@Controller('/users')
@injectable()
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@InjectRepository(UserModel) private userRepository: UserRepository, @inject(ConfigurationService) private configurationService: ConfigurationService) {}

    @GET('/:id')
  get () {

  }

   @POST('/')
    create () {

    }

  @PATCH('/')
   update () {

   }

  @DELETE('/')
  delete () {

  }

  @GET('/')
  public list (@JsonApiQueryParams() queryParams: any) {
    return this.userRepository.jsonApiRequest(queryParams);
  }
}
