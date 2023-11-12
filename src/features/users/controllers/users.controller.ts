import { inject } from '@triptyk/nfw-core';
import { JsonApiCreate, JsonApiDelete, JsonApiFindAll, JsonApiGet, JsonApiUpdate } from '@triptyk/nfw-resources';
import type { JsonApiQuery, ResourceSerializer } from '@triptyk/nfw-resources';
import { UserResourceServiceImpl } from '../resources/user/service.js';
import type { UserResourceService } from '../resources/user/service.js';
import { UserResourceAuthorizerImpl } from '../resources/user/authorizer.js';
import type { UserResourceAuthorizer } from '../resources/user/authorizer.js';
import type { InferType } from 'yup';
import { createUserValidationSchema, updateUserValidationSchema } from '../validators/user.validator.js';
import { Controller, Param } from '@triptyk/nfw-http';
import { JsonApiQueryDecorator } from '../../../decorators/json-api-query.js';
import { CurrentUser } from '../../../decorators/current-user.decorator.js';
import { UserModel, serializeUser } from '../models/user.model.js';
import { JsonApiBody } from '../../../decorators/json-api-body.js';
import { UsersSerializer } from '../resources/user/serializer.js';
import { canOrFail } from '../../../utils/can-or-fail.js';

const RESOURCE_NAME = 'users';

@Controller({
  routeName: `/${RESOURCE_NAME}`
})
export class UsersController {
  public constructor (
    @inject(UserResourceServiceImpl) public service: UserResourceService,
    @inject(UserResourceAuthorizerImpl) public authorizer: UserResourceAuthorizer,
    @inject(UsersSerializer) public serializer: ResourceSerializer
  ) {}

  @JsonApiGet()
  async get (@Param('id') id: string, @JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    const resourceModel = await this.service.getOneOrFail(id, query);
    await canOrFail(this.authorizer, currentUser, 'read', resourceModel);
    return this.serializer.serializeOne(serializeUser(resourceModel), query, {
      endpointURL: `users/${id}`
    });
  }

  @JsonApiFindAll()
  async findAll (@JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    const [resourcesModel, count] = await this.service.getAll(query);
    await canOrFail(this.authorizer, currentUser, 'read', resourcesModel);
    return this.serializer.serializeMany(resourcesModel.map(serializeUser), query, {
      pagination: query.page
        ? {
            total: count,
            size: query.page.size,
            number: query.page.number,
          }
        : undefined,
      endpointURL: 'users'
    });
  }

  @JsonApiCreate()
  async create (@JsonApiBody(RESOURCE_NAME, createUserValidationSchema) body: InferType<typeof createUserValidationSchema>, @CurrentUser() currentUser: UserModel, @JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery) {
    await canOrFail(this.authorizer, currentUser, 'create', body);
    const user = await this.service.create(body);
    return this.serializer.serializeOne(serializeUser(user), query, {
      endpointURL: `users/${user.id}`
    });
  }

  @JsonApiUpdate()
  async update (@JsonApiBody(RESOURCE_NAME, updateUserValidationSchema) body: InferType<typeof updateUserValidationSchema>, @Param('id') id: string, @CurrentUser() currentUser: UserModel, @JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery) {
    await canOrFail(this.authorizer, currentUser, 'update', body);
    const user = await this.service.update(id, body);
    return this.serializer.serializeOne(serializeUser(user), query, {
      endpointURL: `users/${user.id}`
    });
  }

  @JsonApiDelete()
  async delete (@Param('id') id: string, @CurrentUser() currentUser: UserModel) {
    const user = await this.service.getOneOrFail(id, {});
    await canOrFail(this.authorizer, currentUser, 'delete', user);
    await this.service.delete(id);
    return null;
  }
}
