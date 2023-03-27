import { AbilityBuilder, createMongoAbility, subject } from '@casl/ability';
import type { RouterContext } from '@koa/router';
import { singleton } from '@triptyk/nfw-core';
import type { ResourceAuthorizer } from 'resources';
import type { UserModel } from '../../../database/models/user.model.js';
import { Roles } from '../../enums/roles.enum.js';
import type { UserResource } from './resource.js';

type Context = RouterContext;
type Actions = 'create' | 'read' | 'update' | 'delete';

@singleton()
export class UserResourceAuthorizer implements ResourceAuthorizer<UserModel, UserResource, Actions, Context> {
  public can (user: UserModel, action: string, target: UserResource) {
    const ability = this.defineAbilityFor(user);
    return ability.can(action, subject('user', target));
  }

  // eslint-disable-next-line class-methods-use-this
  private defineAbilityFor (user: UserModel) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    if (user.role === Roles.ADMIN) {
      can('read', 'user', {
        role: {
          $ne: 'admin'
        }
      });
      can('create', 'user', {
        role: {
          $ne: 'admin'
        }
      });
    } else {
      can('read', 'user', {
        id: user.id
      });
      can('update', 'user', ['firstName', 'lastName'], {
        id: user.id
      })
    }

    return build();
  }
}
