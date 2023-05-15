import { inject } from '@triptyk/nfw-core';
import { JsonApiCreate, JsonApiDelete, JsonApiFindAll, JsonApiGet, JsonApiQuery, JsonApiResourceSerializer, JsonApiUpdate, ResourceSerializer } from '@triptyk/nfw-resources';
import { UserResourceServiceImpl, UserResourceService } from '../resources/user/service.js';
import { UserResourceAuthorizer, UserResourceAuthorizerImpl } from '../resources/user/authorizer.js';
import { InferType } from 'yup';
import { createUserValidationSchema, updateUserValidationSchema } from '../validators/user.validator.js';
import { Controller, Param } from '@triptyk/nfw-http';
import { JsonApiQueryDecorator } from '../decorators/json-api-query.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import { UserModel } from '../../database/models/user.model.js';
import { JsonApiBody } from '../decorators/json-api-body.js';
import { jsonApiCreateFunction, jsonApiDeleteFunction, jsonApiFindAllFunction, jsonApiGetFunction, jsonApiUpdateFunction } from '../resources/base/controller.js';
import { RESOURCE_NAME } from '../resources/user/schema.js';

@Controller({
  routeName: `/${RESOURCE_NAME}`
})
export class UsersController {
  public constructor (
    @inject(UserResourceServiceImpl) public service: UserResourceService,
    @inject(UserResourceAuthorizerImpl) public authorizer: UserResourceAuthorizer,
    @inject(JsonApiResourceSerializer) public serializer: ResourceSerializer
  ) {}

  @JsonApiGet()
  async get (@Param('id') id: string, @JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    return jsonApiGetFunction.call(this, id, query, currentUser, `${RESOURCE_NAME}/${id}`);
  }

  @JsonApiFindAll()
  async findAll (@JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    return jsonApiFindAllFunction.call(this, query, currentUser, `${RESOURCE_NAME}`);
  }

  @JsonApiCreate()
  async create (@JsonApiBody(RESOURCE_NAME, createUserValidationSchema) body: InferType<typeof createUserValidationSchema>, @CurrentUser() currentUser: UserModel) {
    return jsonApiCreateFunction.call(this, currentUser, body, `${RESOURCE_NAME}`);
  }

  @JsonApiUpdate()
  async update (@JsonApiBody(RESOURCE_NAME, updateUserValidationSchema) body: InferType<typeof updateUserValidationSchema>, @Param('id') id: string, @CurrentUser() currentUser: UserModel) {
    return jsonApiUpdateFunction.call(this, currentUser, body, id, `${RESOURCE_NAME}/${id}`);
  }

  @JsonApiDelete()
  async delete (@Param('id') id: string, @CurrentUser() currentUser: UserModel) {
    return jsonApiDeleteFunction.call(this, id, currentUser);
  }
}
