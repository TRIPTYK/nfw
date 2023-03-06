import type { EntityRepository } from '@mikro-orm/core';
import { singleton } from '@triptyk/nfw-core';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import type { JsonApiQuery } from '@triptyk/nfw-resources';
import { JsonApiResourceAdapter } from '@triptyk/nfw-resources';
import { UserModel } from '../../../database/models/user.model.js';
import { Roles } from '../../enums/roles.enum.js';
import type { DocumentResource } from './resource.js';

@singleton()
export class DocumentResourceAdapter extends JsonApiResourceAdapter<DocumentResource> {
  async findAll (query: JsonApiQuery): Promise<[DocumentResource[], number]> {
    const [all, count] = await this.repository.findAndCount<'id'>({}, {
      populate: query.include.map((i) => i.relationName) as never
    });

    const resources: DocumentResource[] = await Promise.all(all.map(async (resource) => {
      return this.ownRegistry.factory.create(resource.toObject());
    }));

    return [resources, count];
  }

  findById (): DocumentResource {
    throw new Error('Method not implemented.');
  }

  constructor (
    @injectRepository(UserModel) private repository: EntityRepository<UserModel>
  ) {
    super();
  }

  public async create (resource: DocumentResource): Promise<void> {
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
