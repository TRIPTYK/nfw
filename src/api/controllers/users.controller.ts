import { Controller, DELETE, GET, injectable, InjectRepository, PATCH, POST, UseResponseHandler, UseMiddleware } from '@triptyk/nfw-core'
import { JsonApiQueryParams, ValidatedJsonApiQueryParams } from '../../json-api/decorators/json-api-params.js';
import { UserModel } from '../models/user.model.js';
import { UserQueryParamsSchema } from '../query-params-schema/user.schema.js';
import { UserRepository } from '../repositories/user.repository.js';
import { JsonApiResponsehandler } from '../../json-api/response-handlers/json-api.response-handler.js';
import { UserSerializer } from '../serializer/user.serializer.js';
import { deserialize } from '../middlewares/deserialize.middleware.js';
import { UserDeserializer } from '../deserializer/user.deserializer.js';
import { CurrentUserMiddleware } from '../middlewares/current-user.middleware.js';
import { ValidatedUser } from '../validators/user.validators.js';
import { ValidatedBody } from '../decorators/validated-body.decorator.js';

@Controller('/users')
@injectable()
@UseMiddleware(CurrentUserMiddleware)
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@InjectRepository(UserModel) private userRepository: UserRepository) {

  }

  @GET('/:id')
  get () {
  }

  @POST('/')
  @UseMiddleware(deserialize(UserDeserializer))
  @UseResponseHandler(JsonApiResponsehandler, UserSerializer)
  create (@ValidatedBody(ValidatedUser) body: ValidatedUser) {
    return this.userRepository.jsonApiCreate(body);
  }

  @PATCH('/')
  update () {

  }

  @DELETE('/')
  delete () {

  }

  @GET('/')
  @UseResponseHandler(JsonApiResponsehandler, UserSerializer)
  public async list (@JsonApiQueryParams(UserQueryParamsSchema) queryParams: ValidatedJsonApiQueryParams) {
    const users = await this.userRepository.jsonApiRequest(queryParams).getResultList();
    return users;
  }
}
