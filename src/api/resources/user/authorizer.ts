import { defineAbility, subject } from '@casl/ability';
import type { EntityData } from '@mikro-orm/core';
import { singleton } from '@triptyk/nfw-core';
import type { Promisable } from 'type-fest';
import type { UserModel } from '../../../database/models/user.model.js';
import { Roles } from '../../enums/roles.enum.js';

type Action = 'create' | 'update' | 'delete' | 'read';

export interface UserResourceAuthorizer {
    can(actor: UserModel | undefined, action: Action, on: EntityData<UserModel>, inContext: unknown): Promisable<boolean>,
}

@singleton()
export class UserResourceAuthorizerImpl implements UserResourceAuthorizer {
  can (actor: UserModel | undefined, action: Action, on: UserModel, inContext: unknown): Promisable<boolean> {
    const ability = this.ability(actor, inContext);

    return ability.can(action, subject('user', on));
  }

  private ability (actor: UserModel | undefined, _c: unknown) {
    return defineAbility((can) => {
      if (actor === undefined) {
        return;
      }

      can('read', 'user');
      if (actor.role === Roles.ADMIN) {
        can(['update', 'delete'], 'user', { role: { $not: { $eq: Roles.ADMIN } } });
      }
      can('update', 'user', {
        id: {
          $eq: actor.id
        }
      });
      can('update', 'user', {
        id: {
          $neq: actor.id
        }
      })
    })
  }
}
