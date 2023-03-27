import type { EntityRepository } from '@mikro-orm/core';
import { delay, inject, singleton } from '@triptyk/nfw-core';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import type { ResourceAdapter, ResourcesRegistry } from 'resources';
import { assign } from 'resources';
import { UserModel } from '../../../database/models/user.model.js';
import { Roles } from '../../enums/roles.enum.js';
import { ResourcesRegistryImpl } from '../registry.js';
import { UserResource } from './resource.js';

@singleton()
export class UserResourceAdapter implements ResourceAdapter {
  public constructor (
    @injectRepository(UserModel) private repository: EntityRepository<UserModel>,
    @inject(delay(() => ResourcesRegistryImpl)) private registry: ResourcesRegistry
  ) {}

  async findById (id: string): Promise<UserResource> {
    const user = await this.repository.findOneOrFail<'id'>(id);

    const resource = new UserResource();

    assign(resource, {
      ...user.toPOJO(),
      documents: user.documents.getItems().map((d) => d.id)
    }, this.registry);

    return resource;
  }

  public async create (resource: UserResource): Promise<void> {
    const userModel = this.repository.create({
      firstName: resource.firstName,
      lastName: resource.lastName,
      email: resource.email,
      password: '123',
      role: Roles.ADMIN
    });

    await this.repository.persistAndFlush(userModel);

    resource.id = userModel.id;
  }
}
