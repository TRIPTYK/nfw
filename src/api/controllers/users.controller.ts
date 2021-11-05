import { Controller, DELETE, GET, injectable, InjectRepository, PATCH, POST, UseResponseHandler, UseMiddleware, Param, UseGuard } from '@triptyk/nfw-core'
import { JsonApiQueryParams, ValidatedJsonApiQueryParams } from '../../json-api/decorators/json-api-params.js';
import { UserModel } from '../models/user.model.js';
import { UserQueryParamsSchema } from '../query-params-schema/user.schema.js';
import { UserRepository } from '../repositories/user.repository.js';
import { JsonApiResponsehandler } from '../../json-api/response-handlers/json-api.response-handler.js';
import { UserSerializer } from '../serializer/user.serializer.js';
import { deserialize } from '../middlewares/deserialize.middleware.js';
import { UserDeserializer } from '../deserializer/user.deserializer.js';
import { CurrentUserMiddleware } from '../middlewares/current-user.middleware.js';
import { ValidatedUser, ValidatedUserUpdate } from '../validators/user.validators.js';
import { ValidatedBody } from '../decorators/validated-body.decorator.js';
import { GuardCreate } from '../../json-api/guards/create.guard.js';

@Controller('/users')
@injectable()
@UseMiddleware(CurrentUserMiddleware)
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@InjectRepository(UserModel) private userRepository: UserRepository) {}

  @GET('/')
  @UseResponseHandler(JsonApiResponsehandler, UserSerializer)
  public async list (@JsonApiQueryParams(UserQueryParamsSchema) queryParams: ValidatedJsonApiQueryParams) {
    return {
      payload: await this.userRepository.jsonApiFind(queryParams),
      queryParams,
    };
  }

  @GET('/:id')
  @UseResponseHandler(JsonApiResponsehandler, UserSerializer)
  async get (@JsonApiQueryParams(UserQueryParamsSchema) queryParams: ValidatedJsonApiQueryParams, @Param('id') id : string) {
    return {
      payload: await this.userRepository.jsonApiFindOne({
        id,
      }, queryParams),
      queryParams,
    };
  }

  @POST('/')
  @UseMiddleware(deserialize(UserDeserializer))
  @UseGuard(GuardCreate, UserModel)
  @UseResponseHandler(JsonApiResponsehandler, UserSerializer)
  create (@ValidatedBody(ValidatedUser) body: ValidatedUser) {
    return this.userRepository.jsonApiCreate(body);
  }

  @PATCH('/:id')
  @UseMiddleware(deserialize(UserDeserializer))
  @UseResponseHandler(JsonApiResponsehandler, UserSerializer)
  update (@ValidatedBody(ValidatedUserUpdate) body: ValidatedUserUpdate, @Param('id') id: string) {
    return this.userRepository.jsonApiUpdate(body, { id: id });
  }

  @DELETE('/:id')
  @UseResponseHandler(JsonApiResponsehandler, UserSerializer)
  delete (@Param('id') id: string) {
    return this.userRepository.jsonApiRemove({ id: id });
  }
}
