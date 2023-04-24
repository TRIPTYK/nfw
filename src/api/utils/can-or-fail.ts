import type { UserModel } from '../../database/models/user.model.js';
import { ForbiddenError } from '../errors/web/forbidden.js';
import type { AuthorizerAction, ResourceAuthorizer } from '../resources/base/authorizer.js';

export async function canOrFail<T> (authorizer: ResourceAuthorizer<T>, actor: UserModel, action: AuthorizerAction, on: T, inContext: unknown) {
  if (!await authorizer.can(actor, action, on, inContext)) {
    throw new ForbiddenError();
  }
}
