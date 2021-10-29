import { Controller, DELETE, GET, injectable, InjectRepository, PATCH, POST, UseResponseHandler } from '@triptyk/nfw-core'
import { JsonApiQueryParams } from '../../json-api/decorators/json-api-params.js';
import { UserModel } from '../models/user.model.js';
import { UserQueryParamsSchema } from '../query-params-schema/user.schema.js';
import { UserRepository } from '../repositories/user.repository.js';
import { JsonApiResponsehandler } from '../../json-api/response-handlers/json-api.response-handler.js';
import { UserSerializer } from '../serializer/user.serializer.js';
import { AclService } from '../services/acl.service.js';

@Controller('/users')
@injectable()
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@InjectRepository(UserModel) private userRepository: UserRepository, private aclService: AclService) {

  }

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
  @UseResponseHandler(JsonApiResponsehandler, UserSerializer)
  public async list (@JsonApiQueryParams(UserQueryParamsSchema) queryParams: any) {
    const users = await this.userRepository.jsonApiRequest(queryParams).getResultList();
    return users;
  }
}
