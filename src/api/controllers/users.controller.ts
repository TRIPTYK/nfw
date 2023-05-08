import { inject } from '@triptyk/nfw-core';
import { JsonApiCreate, JsonApiDelete, JsonApiFindAll, JsonApiGet, JsonApiQuery, JsonApiUpdate, ResourceSerializer } from '@triptyk/nfw-resources';
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
import { UsersSerializer } from '../resources/user/serializer.js';
import type { UserResource } from '../resources/user/schema.js';

const RESOURCE_NAME = 'users';

@Controller({
  routeName: `/${RESOURCE_NAME}`
})
export class UsersController {
  public constructor (
    @inject(UserResourceServiceImpl) public service: UserResourceService,
    @inject(UserResourceAuthorizerImpl) public authorizer: UserResourceAuthorizer,
    @inject(UsersSerializer) public serializer: ResourceSerializer<UserResource>
  ) {}

  @JsonApiGet()
  async get (@Param('id') id: string, @JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    return jsonApiGetFunction.call(this, id, query, currentUser);
  }

  @JsonApiFindAll()
  async findAll (@JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    return jsonApiFindAllFunction.call(this, query, currentUser);
  }

  @JsonApiCreate()
  async create (@JsonApiBody(RESOURCE_NAME, createUserValidationSchema) body: InferType<typeof createUserValidationSchema>, @CurrentUser() currentUser: UserModel) {
    return jsonApiCreateFunction.call(this, currentUser, body);
  }

  @JsonApiUpdate()
  async update (@JsonApiBody(RESOURCE_NAME, updateUserValidationSchema) body: InferType<typeof updateUserValidationSchema>, @Param('id') id: string, @CurrentUser() currentUser: UserModel) {
    return jsonApiUpdateFunction.call(this, currentUser, body, id);
  }

  @JsonApiDelete()
  async delete (@Param('id') id: string, @CurrentUser() currentUser: UserModel) {
    return jsonApiDeleteFunction.call(this, id, currentUser);
  }
}
