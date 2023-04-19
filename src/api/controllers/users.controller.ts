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
import type { createUserValidationSchema, updateUserValidationSchema } from '../validators/user.validator.js';

@injectable()
export class UsersController {
  public constructor (
    @inject(UserResourceServiceImpl) public usersService: UserResourceService,
    @inject(ResourcesRegistryImpl) public registry: ResourcesRegistry,
    @inject(UserResourceAuthorizerImpl) public authorizer: UserResourceAuthorizer
  ) {}

  async get (id: string, query: JsonApiQuery) {
    const user = await this.usersService.getOne(id, query);

    if (!user) {
      throw new NotFoundError();
    }

    if (!this.authorizer.can(undefined, 'read', user, {})) {
      throw new ForbiddenError();
    }

    return this.registry.getSerializerFor('users').serializeOne(user as never);
  }

  async findAll (query: JsonApiQuery) {
    const [users] = await this.usersService.getAll(query);

    for (const user of users) {
      if (!this.authorizer.can(undefined, 'read', user, {})) {
        throw new ForbiddenError();
      }
    }

    return this.registry.getSerializerFor('users').serializeMany(users as never);
  }

  async create (body: InferType<typeof createUserValidationSchema>) {
    if (!this.authorizer.can(undefined, 'create', body, {})) {
      throw new ForbiddenError();
    }

    const user = await this.usersService.create(body);

    return this.registry.getSerializerFor('users').serializeOne(user as never);
  }

  async update (id: string, body: InferType<typeof updateUserValidationSchema>) {
    if (!this.authorizer.can(undefined, 'update', body, {})) {
      throw new ForbiddenError();
    }

    const user = await this.usersService.update(id, body);

    return this.registry.getSerializerFor('users').serializeOne(user as never);
  }

  async delete (id: string) {
    const user = await this.usersService.getOne(id, {});

    if (!user) {
      throw new NotFoundError();
    }

    if (!this.authorizer.can(undefined, 'delete', user, {})) {
      throw new ForbiddenError();
    }

    await this.usersService.delete(id);

    return null;
  }
}
