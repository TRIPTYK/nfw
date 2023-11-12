import { wrap, EntityRepository } from '@mikro-orm/core';
import type { Loaded, RequiredEntityData, EntityData } from '@mikro-orm/core';
import { NotFoundError } from '../../../../errors/not-found.js';
import { singleton } from '@triptyk/nfw-core';
import { injectRepository } from '@triptyk/nfw-mikro-orm';
import type { JsonApiQuery } from '@triptyk/nfw-resources';
import { DocumentModel } from '../../models/document.model.js';
import { jsonApiQueryToFindOptions } from '../../../../utils/query/json-api-query-to-find-options.js';
import type { ResourceService } from '../../../shared/resources/base/service.js';

export type DocumentResourceService = ResourceService<DocumentModel>;

@singleton()
export class DocumentResourceServiceImpl implements DocumentResourceService {
  public constructor (
    @injectRepository(DocumentModel) public documentRepository: EntityRepository<DocumentModel>,
  ) {}

  public async getOne (id: string, query: JsonApiQuery) {
    const doc = await this.documentRepository.findOne(id, jsonApiQueryToFindOptions(query));
    return doc;
  }

  public async getOneOrFail (id: string, query: JsonApiQuery) {
    const result = await this.getOne(id, query);

    if (!result) {
      throw new NotFoundError();
    }

    return result;
  }

  public async getAll (query: JsonApiQuery) {
    const [documents, number] = await this.documentRepository.findAndCount({}, jsonApiQueryToFindOptions(query));
    return [documents, number] as [Loaded<DocumentModel, never>[], number];
  }

  async create (body: RequiredEntityData<DocumentModel>): Promise<Loaded<DocumentModel, never>> {
    const document = this.documentRepository.create(body);
    await this.documentRepository.getEntityManager().persistAndFlush(document);
    return document;
  }

  async update (id: string, body: EntityData<DocumentModel>): Promise<Loaded<DocumentModel, never>> {
    const existing = await this.documentRepository.findOneOrFail({
      id
    });
    const user = wrap(existing).assign(body);
    await this.documentRepository.getEntityManager().persistAndFlush(user);
    return user;
  }

  async delete (id: string): Promise<void> {
    const existing = await this.documentRepository.findOneOrFail(id);
    await this.documentRepository.getEntityManager().removeAndFlush(existing);
  }
}
