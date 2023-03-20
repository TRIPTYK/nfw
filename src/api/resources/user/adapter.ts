import type { EntityRepository } from '@mikro-orm/core';
import { singleton } from '@triptyk/nfw-core';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import type { JsonApiQuery } from '@triptyk/nfw-resources';
import { JsonApiResourceAdapter } from '@triptyk/nfw-resources';
import type { Promisable } from 'type-fest';
import { UserModel } from '../../../database/models/user.model.js';
import { Roles } from '../../enums/roles.enum.js';
import type { UserResource } from './resource.js';

@singleton()
export class UserResourceAdapter extends JsonApiResourceAdapter<UserResource> {
  constructor (
    @injectRepository(UserModel) private repository: EntityRepository<UserModel>
  ) {
    super();
  }

  async findAll (query: JsonApiQuery): Promise<[UserResource[], number]> {
    const [all, count] = await this.repository.findAndCount<'id'>({}, {
      populate: query.include?.map((i) => i.relationName) as never
    });

    const resources: UserResource[] = await Promise.all(all.map(async (resource) => {
      return this.ownRegistry.factory.create(resource.toObject());
    }));

    return [resources, count];
  }

  async findById (id: string): Promise<UserResource> {
    const user = await this.repository.findOneOrFail<'id'>(id);

    const resource = await this.ownRegistry.factory.create(user.toObject());

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

  update (resource: UserResource, query: JsonApiQuery): Promisable<void> {

  }

  delete (resource: UserResource, query: JsonApiQuery): Promisable<void> {
    throw new Error('Method not implemented.');
  }
}
