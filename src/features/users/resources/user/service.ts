import type { EntityData, Loaded, RequiredEntityData } from '@mikro-orm/core';
import { wrap, EntityRepository } from '@mikro-orm/core';
import { singleton } from '@triptyk/nfw-core';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import type { JsonApiQuery } from '@triptyk/nfw-resources';
import { UserModel } from '../../models/user.model.js';
import { NotFoundError } from '../../../../errors/not-found.js';
import { jsonApiQueryToFindOptions } from '../../../../utils/query/json-api-query-to-find-options.js';
import type { ResourceService } from '../../../shared/resources/base/service.js';

export type UserResourceService = ResourceService<UserModel>;

@singleton()
export class UserResourceServiceImpl implements UserResourceService {
  public constructor (
    @injectRepository(UserModel) public usersRepository: EntityRepository<UserModel>
  ) {

  }

  public async getOne (id: string, query: JsonApiQuery) {
    const user = await this.usersRepository.findOne(id, jsonApiQueryToFindOptions(query));

    return user;
  }

  public async getOneOrFail (id: string, query: JsonApiQuery) {
    const result = await this.getOne(id, query);

    if (!result) {
      throw new NotFoundError();
    }

    return result;
  }

  public async getAll (query: JsonApiQuery) {
    const [users, number] = await this.usersRepository.findAndCount({}, jsonApiQueryToFindOptions(query));

    return [users, number] as [Loaded<UserModel, never>[], number];
  }

  async create (body: RequiredEntityData<UserModel>): Promise<Loaded<UserModel, never>> {
    const user = this.usersRepository.create(body);
    await this.usersRepository.getEntityManager().persistAndFlush(user);
    return user;
  }

  async update (id: string, body: EntityData<UserModel>): Promise<Loaded<UserModel, never>> {
    const existing = await this.usersRepository.findOneOrFail(id);
    const user = wrap(existing).assign(body);
    await this.usersRepository.getEntityManager().persistAndFlush(user);
    return user;
  }

  async delete (id: string): Promise<void> {
    const existing = await this.usersRepository.findOneOrFail(id);
    await this.usersRepository.getEntityManager().removeAndFlush(existing);
  }
}
