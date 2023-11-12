import { defineAbility, subject } from '@casl/ability';
import type { EntityData } from '@mikro-orm/core';
import { singleton } from '@triptyk/nfw-core';
import type { Promisable } from 'type-fest';
import type { UserModel } from '../../models/user.model.js';
import { Roles } from '../../enums/roles.enum.js';
import type { AuthorizerAction, ResourceAuthorizer } from '../../../shared/resources/base/authorizer.js';

export type UserResourceAuthorizer = ResourceAuthorizer<UserModel>;

@singleton()
export class UserResourceAuthorizerImpl implements UserResourceAuthorizer {
  can (actor: UserModel | undefined, action: AuthorizerAction, on: EntityData<UserModel>): Promisable<boolean> {
    const ability = this.ability(actor);
    return ability.can(action, subject('user', on));
  }

  private ability (actor: UserModel | undefined) {
    return defineAbility((can) => {
      if (actor === undefined) {
        return;
      }

      can('read', 'user');

      if (actor.role === Roles.ADMIN) {
        can(['create'], 'user');
        can(['update'], 'user');
        can(['delete'], 'user', { role: { $in: [Roles.USER] } });
      }

      can(['update'], 'user', {
        id: {
          eq: actor.id
        }
      });
    })
  }
}
