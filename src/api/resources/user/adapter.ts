import type { EntityRepository } from '@mikro-orm/core';
import { delay, inject, singleton } from '@triptyk/nfw-core';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import type { ResourcesRegistry } from 'resources';
import { assign } from 'resources';
import { UserModel } from '../../../database/models/user.model.js';
import type { JsonApiResourceAdapter } from '@triptyk/nfw-resources';
import { ResourcesRegistryImpl } from '@triptyk/nfw-resources';
import { UserResource } from './resource.js';
import type { Promisable } from 'type-fest';

@singleton()
export class UserResourceAdapter implements JsonApiResourceAdapter<UserResource> {
  public constructor (
    @injectRepository(UserModel) private repository: EntityRepository<UserModel>,
    @inject(delay(() => ResourcesRegistryImpl)) private registry: ResourcesRegistry
  ) {}

  findAll (): Promisable<[UserResource[], number]> {
    throw new Error('Method not implemented.');
  }

  async findById (id: string): Promise<UserResource> {
    const user = await this.repository.findOneOrFail(id, {
      populate: ['documents']
    });

    const resource = new UserResource();

    assign(resource, {
      ...user.toObject(['refreshToken']),
      documents: user.documents.getItems().map((d) => d.id)
    }, this.registry);

    return resource;
  }

  public async create (resource: UserResource): Promise<void> {
    const userModel = this.repository.create({
      firstName: resource.firstName,
      lastName: resource.lastName,
      email: resource.email,
      password: resource.password,
      role: resource.role
    });

    await this.repository.persistAndFlush(userModel);

    resource.id = userModel.id;
  }

  public async update (resource: UserResource): Promise<void> {
    const userModel = await this.repository.findOneOrFail(resource.id!);
    userModel.assign(resource);
    await this.repository.persistAndFlush(userModel);
  }

  public async delete (resource: UserResource): Promise<void> {
    const userModel = await this.repository.findOneOrFail(resource.id!);
    await this.repository.removeAndFlush(userModel);
  }
}
