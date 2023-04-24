import { inject, injectable } from '@triptyk/nfw-core';
import type { JsonApiQuery, ResourcesRegistry } from '@triptyk/nfw-resources';
import { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import { NotFoundError } from '../errors/web/not-found.js';
import { UserResourceServiceImpl } from '../resources/user/service.js';
import type { UserResourceService } from '../resources/user/service.js';
import type { UserResourceAuthorizer } from '../resources/user/authorizer.js';
import { UserResourceAuthorizerImpl } from '../resources/user/authorizer.js';
import { ForbiddenError } from '../errors/web/forbidden.js';
import type { InferType } from 'yup';
import { createUserValidationSchema, updateUserValidationSchema } from '../validators/user.validator.js';
import { Controller, GET, Param } from '@triptyk/nfw-http';
import { ValidatedBody } from '../decorators/validated-body.js';
import { JsonApiQueryDecorator } from '../decorators/json-api-query.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import type { UserModel } from '../../database/models/user.model.js';

@injectable()
@Controller({
  routeName: '/users'
})
export class UsersController {
  public constructor (
    @inject(UserResourceServiceImpl) public usersService: UserResourceService,
    @inject(ResourcesRegistryImpl) public registry: ResourcesRegistry,
    @inject(UserResourceAuthorizerImpl) public authorizer: UserResourceAuthorizer
  ) {}

  @GET('/:id')
  async get (@Param('id') id: string, query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    const user = await this.usersService.getOne(id, query);

    if (!user) {
      throw new NotFoundError();
    }

    if (!this.authorizer.can(currentUser, 'read', user, {})) {
      throw new ForbiddenError();
    }

    return this.registry.getSerializerFor('users').serializeOne(user as never);
  }

  @GET('/')
  async findAll (@JsonApiQueryDecorator('users') query: JsonApiQuery, @CurrentUser() currentUser: UserModel) {
    const [users, count] = await this.usersService.getAll(query);

    for (const user of users) {
      if (!this.authorizer.can(currentUser, 'read', user, {})) {
        throw new ForbiddenError();
      }
    }

    return this.registry.getSerializerFor('users').serializeMany(users, query.page ? { ...query.page, total: count } : undefined);
  }

  async create (@ValidatedBody(createUserValidationSchema) body: InferType<typeof createUserValidationSchema>, @CurrentUser() currentUser: UserModel) {
    if (!this.authorizer.can(currentUser, 'create', body, {})) {
      throw new ForbiddenError();
    }

    const user = await this.usersService.create(body);

    return this.registry.getSerializerFor('users').serializeOne(user as never);
  }

  async update (@Param('id') id: string, @ValidatedBody(updateUserValidationSchema) body: InferType<typeof updateUserValidationSchema>, @CurrentUser() currentUser: UserModel) {
    if (!this.authorizer.can(currentUser, 'update', body, {})) {
      throw new ForbiddenError();
    }

    const user = await this.usersService.update(id, body);

    return this.registry.getSerializerFor('users').serializeOne(user as never);
  }

  async delete (@Param('id') id: string, @CurrentUser() currentUser: UserModel) {
    const user = await this.usersService.getOne(id, {});

    if (!user) {
      throw new NotFoundError();
    }

    if (!this.authorizer.can(currentUser, 'delete', user, {})) {
      throw new ForbiddenError();
    }

    await this.usersService.delete(id);

    return null;
  }
}
