import type { EntityData } from '@mikro-orm/core';
import type { Promisable } from 'type-fest';
import type { UserModel } from '../../../users/models/user.model.js';

export type AuthorizerAction = 'create' | 'update' | 'delete' | 'read';

export interface ResourceAuthorizer<On> {
    can(actor: UserModel | undefined, action: AuthorizerAction, on: EntityData<On>): Promisable<boolean>,
}
