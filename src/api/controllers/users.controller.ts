import { Controller, DELETE, GET, injectable, InjectRepository, PATCH, POST, UseResponseHandler, inject } from '@triptyk/nfw-core'
import { JsonApiQueryParams } from '../../json-api/decorators/json-api-params.js';
import { UserModel } from '../models/user.model.js';
import { UserQueryParamsSchema } from '../query-params-schema/user.schema.js';
import { UserRepository } from '../repositories/user.repository.js';
import { JsonApiResponsehandler } from '../../json-api/response-handlers/json-api.response-handler.js';
import { UserSerializer } from '../serializer/user.serializer.js';

@Controller('/users')
@injectable()
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@InjectRepository(UserModel) private userRepository: UserRepository) {}

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
  public list (@JsonApiQueryParams(UserQueryParamsSchema) queryParams: any) {
    return this.userRepository.jsonApiRequest(queryParams).getResultList();
  }
}
