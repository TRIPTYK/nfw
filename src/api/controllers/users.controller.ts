import { Controller, DELETE, GET, injectable, InjectRepository, PATCH, POST, UseResponseHandler, UseMiddleware, Param, inject, UseGuard, UseErrorHandler } from '@triptyk/nfw-core';
import { JsonApiQueryParams, ValidatedJsonApiQueryParams } from '../../json-api/decorators/json-api-params.js';
import { UserModel } from '../models/user.model.js';
import { UserQueryParamsSchema } from '../query-params-schema/user.schema.js';
import { UserRepository } from '../repositories/user.repository.js';
import { JsonApiResponsehandler } from '../../json-api/response-handlers/json-api.response-handler.js';
import { UserSerializer } from '../serializer/user.serializer.js';
import { deserialize } from '../middlewares/deserialize.middleware.js';
import { UserDeserializer } from '../deserializer/user.deserializer.js';
import { ValidatedUser, ValidatedUserUpdate } from '../validators/user.validators.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import { EntityFromBody } from '../decorators/entity-from-body.decorator.js';
import { AclService } from '../services/acl.service.js';
import { EntityFromParam } from '../decorators/entity-from-param.decorator.js';
import { AuthorizeGuard } from '../guards/authorize.guard.js';
import { JsonApiErrorHandler } from '../../json-api/error-handler/json-api.error-handler.js';

@Controller('/users')
@UseGuard(AuthorizeGuard)
@UseErrorHandler(JsonApiErrorHandler)
@UseResponseHandler(JsonApiResponsehandler, UserSerializer)
@injectable()
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
  constructor (@InjectRepository(UserModel) private userRepository: UserRepository, @inject(AclService) private aclService: AclService) {}

  @GET('/')
  public async list (@JsonApiQueryParams(UserQueryParamsSchema) queryParams: ValidatedJsonApiQueryParams, @CurrentUser() currentUser?: UserModel) {
    return {
      payload: await this.userRepository.jsonApiFind(queryParams, currentUser),
      queryParams,
    };
  }

  @GET('/:id')
  async get (@JsonApiQueryParams(UserQueryParamsSchema) queryParams: ValidatedJsonApiQueryParams, @Param('id') id : string, @CurrentUser() currentUser?: UserModel) {
    return {
      payload: await this.userRepository.jsonApiFindOne({
        id,
      }, queryParams, currentUser),
      queryParams,
    };
  }

  @POST('/')
  @UseMiddleware(deserialize(UserDeserializer))
  async create (@EntityFromBody(ValidatedUser, UserModel) body: UserModel, @CurrentUser() currentUser?: UserModel) {
    await this.aclService.enforce(UserModel.ability, currentUser, 'create', body);
    return this.userRepository.jsonApiCreate(body);
  }

  @PATCH('/:id')
  @UseMiddleware(deserialize(UserDeserializer))
  async update (@EntityFromBody(ValidatedUserUpdate, UserModel) user: UserModel, @Param('id') id: string, @CurrentUser() currentUser?: UserModel) {
    await this.aclService.enforce(UserModel.ability, currentUser, 'update', user);
    return this.userRepository.jsonApiUpdate(user, { id }, currentUser);
  }

  @DELETE('/:id')
  async delete (@EntityFromParam('id', UserModel) user: UserModel, @CurrentUser() currentUser?: UserModel) {
    await this.aclService.enforce(UserModel.ability, currentUser, 'delete', user);
    return this.userRepository.jsonApiRemove({ id: user.id }, currentUser);
  }
}
