import type { EntityData, RequiredEntityData } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import type { JsonApiQuery, ResourceSerializer } from '@triptyk/nfw-resources';
import { canOrFail } from 'app/api/utils/can-or-fail.js';
import type { UserModel } from 'app/database/models/user.model.js';
import type { ResourceAuthorizer } from './authorizer.js';
import type { ResourceService } from './service.js';

export interface JsonApiContext<R extends Record<string, unknown>, T> {
    service: ResourceService<T>,
    authorizer: ResourceAuthorizer<T>,
    serializer: ResourceSerializer<R>,
}

export async function jsonApiGetFunction<T, R extends Record<string, unknown>> (this: JsonApiContext<R, T>, id: string, query: JsonApiQuery, currentUser: UserModel) {
  const resourceModel = await this.service.getOneOrFail(id, query);
  await canOrFail(this.authorizer, currentUser, 'read', resourceModel);
  return this.serializer.serializeOne(wrap(resourceModel).toJSON() as never, query);
}

export async function jsonApiFindAllFunction <T, R extends Record<string, unknown>> (this: JsonApiContext<R, T>, query: JsonApiQuery, currentUser: UserModel) {
  const [resourcesModel, count] = await this.service.getAll(query);
  await canOrFail(this.authorizer, currentUser, 'read', resourcesModel);
  return this.serializer.serializeMany(resourcesModel.map((d) => wrap(d).toJSON()) as never, query, query.page ? { ...query.page, total: count } : undefined);
}

export async function jsonApiCreateFunction<T, R extends Record<string, unknown>> (this: JsonApiContext<R, T>, currentUser: UserModel, body: RequiredEntityData<T>) {
  await canOrFail(this.authorizer, currentUser, 'create', body);
  const user = await this.service.create(body);
  return this.serializer.serializeOne(user as never, {});
}

export async function jsonApiUpdateFunction<T, R extends Record<string, unknown>> (this: JsonApiContext<R, T>, currentUser: UserModel, body: EntityData<T>, id: string) {
  await canOrFail(this.authorizer, currentUser, 'update', body);
  const user = await this.service.update(id, body);
  return this.serializer.serializeOne(user as never, {});
}

export async function jsonApiDeleteFunction<T, R extends Record<string, unknown>> (this: JsonApiContext<R, T>, id: string, currentUser: UserModel) {
  const user = await this.service.getOneOrFail(id, {});
  await canOrFail(this.authorizer, currentUser, 'delete', user);
  await this.service.delete(id);
  return null;
}
