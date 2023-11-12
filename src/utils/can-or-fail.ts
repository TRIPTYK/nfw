import type { EntityData } from '@mikro-orm/core';
import type { UserModel } from '../features/users/models/user.model.js';
import { ForbiddenError } from '../errors/forbidden.js';
import type { AuthorizerAction, ResourceAuthorizer } from '../features/shared/resources/base/authorizer.js';

export async function canOrFail<T> (authorizer: ResourceAuthorizer<T>, actor: UserModel, action: AuthorizerAction, on: EntityData<T> | EntityData<T>[]) {
  const targets = Array.isArray(on) ? on : [on];
  await Promise.all(targets.map(async (target) => {
    if (!await authorizer.can(actor, action, target)) {
      throw new ForbiddenError();
    }
  }))
}
