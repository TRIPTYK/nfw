import type { EntityData, RequiredEntityData } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import type { JsonApiQuery, ResourceSerializer } from '@triptyk/nfw-resources';
import { canOrFail } from '../../utils/can-or-fail.js';
import type { UserModel } from '../../../database/models/user.model.js';
import type { ResourceAuthorizer } from './authorizer.js';
import type { ResourceService } from './service.js';

export interface JsonApiContext<T> {
    service: ResourceService<T>,
    authorizer: ResourceAuthorizer<T>,
    serializer: ResourceSerializer,
}

export async function jsonApiGetFunction<T> (this: JsonApiContext<T>, id: string, query: JsonApiQuery, currentUser: UserModel, endpointURL: string) {
  const resourceModel = await this.service.getOneOrFail(id, query);
  await canOrFail(this.authorizer, currentUser, 'read', resourceModel);
  return this.serializer.serializeOne(wrap(resourceModel).toJSON() as never, query, {
    endpointURL
  });
}

export async function jsonApiFindAllFunction <T> (this: JsonApiContext<T>, query: JsonApiQuery, currentUser: UserModel, endpointURL: string) {
  const [resourcesModel, count] = await this.service.getAll(query);
  await canOrFail(this.authorizer, currentUser, 'read', resourcesModel);
  return this.serializer.serializeMany(resourcesModel.map((d) => wrap(d).toJSON()) as never, query, {
    pagination: query.page ? { ...query.page, total: count } : undefined,
    endpointURL,
  });
}

export async function jsonApiCreateFunction<T> (this: JsonApiContext<T>, currentUser: UserModel, body: RequiredEntityData<T>, endpointURL: string) {
  await canOrFail(this.authorizer, currentUser, 'create', body);
  const user = await this.service.create(body);
  return this.serializer.serializeOne(wrap(user).toJSON() as never, {}, {
    endpointURL
  });
}

export async function jsonApiUpdateFunction<T> (this: JsonApiContext<T>, currentUser: UserModel, body: EntityData<T>, id: string, endpointURL: string) {
  await canOrFail(this.authorizer, currentUser, 'update', body);
  const user = await this.service.update(id, body);
  return this.serializer.serializeOne(wrap(user).toJSON() as never, {}, {
    endpointURL
  });
}

export async function jsonApiDeleteFunction<T> (this: JsonApiContext<T>, id: string, currentUser: UserModel) {
  const user = await this.service.getOneOrFail(id, {});
  await canOrFail(this.authorizer, currentUser, 'delete', user);
  await this.service.delete(id);
  return null;
}
