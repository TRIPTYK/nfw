import { inject, injectable } from '@triptyk/nfw-core';
import type { JsonApiQuery, ResourcesRegistry } from '@triptyk/nfw-resources';
import { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import { UserResourceServiceImpl } from '../resources/user/service.js';
import type { UserResourceService } from '../resources/user/service.js';
import type { UserResourceAuthorizer } from '../resources/user/authorizer.js';
import { UserResourceAuthorizerImpl } from '../resources/user/authorizer.js';
import type { InferType } from 'yup';
import { createUserValidationSchema, updateUserValidationSchema } from '../validators/user.validator.js';
import { Controller, DELETE, GET, Param, PATCH, POST } from '@triptyk/nfw-http';
import { JsonApiQueryDecorator } from '../decorators/json-api-query.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import type { UserModel } from '../../database/models/user.model.js';
import { canOrFail } from '../utils/can-or-fail.js';
import { JsonApiBody } from '../decorators/json-api-body.js';
import type { UserResource } from '../resources/user/schema.js';

const RESOURCE_NAME = 'users';

@injectable()
@Controller({
  routeName: `/${RESOURCE_NAME}`
})
export class UsersController {
  public constructor (
    @inject(UserResourceServiceImpl) public usersService: UserResourceService,
    @inject(ResourcesRegistryImpl) public registry: ResourcesRegistry,
    @inject(UserResourceAuthorizerImpl) public authorizer: UserResourceAuthorizer
  ) {}

  @GET('/:id')
  async get (@Param('id') id: string, query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    const user = await this.usersService.getOneOrFail(id, query);
    await canOrFail(this.authorizer, currentUser, 'read', user);
    return this.registry.getSerializerFor<UserResource>(RESOURCE_NAME).serializeOne(user);
  }

  @GET('/')
  async findAll (@JsonApiQueryDecorator(RESOURCE_NAME) query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    const [users, count] = await this.usersService.getAll(query);
    await canOrFail(this.authorizer, currentUser, 'read', users);
    return this.registry.getSerializerFor<UserResource>(RESOURCE_NAME).serializeMany(users, query.page ? { ...query.page, total: count } : undefined);
  }

  @POST('/')
  async create (@JsonApiBody(RESOURCE_NAME, createUserValidationSchema) body: InferType<typeof createUserValidationSchema>, @CurrentUser() currentUser: UserModel) {
    await canOrFail(this.authorizer, currentUser, 'create', body);
    const user = await this.usersService.create(body);
    return this.registry.getSerializerFor<UserResource>(RESOURCE_NAME).serializeOne(user);
  }

  @PATCH('/:id')
  async update (@JsonApiBody(RESOURCE_NAME, updateUserValidationSchema) body: InferType<typeof updateUserValidationSchema>, @Param('id') id: string, @CurrentUser() currentUser: UserModel) {
    await canOrFail(this.authorizer, currentUser, 'update', body);
    const user = await this.usersService.update(id, body);
    return this.registry.getSerializerFor<UserResource>(RESOURCE_NAME).serializeOne(user);
  }

  @DELETE('/:id')
  async delete (@Param('id') id: string, @CurrentUser() currentUser: UserModel) {
    const user = await this.usersService.getOneOrFail(id, {});
    await canOrFail(this.authorizer, currentUser, 'delete', user);
    await this.usersService.delete(id);
    return null;
  }
}
