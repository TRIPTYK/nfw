import { AbilityBuilder, createMongoAbility, subject } from '@casl/ability';
import type { RouterContext } from '@koa/router';
import { singleton } from '@triptyk/nfw-core';
import type { ResourceAuthorizer } from 'resources';
import type { UserModel } from '../../../database/models/user.model.js';
import type { DocumentResource } from './resource.js';

type Context = RouterContext;

@singleton()
export class DocumentResourceAuthorizer implements ResourceAuthorizer<UserModel, DocumentResource, 'action', Context> {
  public can (user: UserModel, action: string) {
    const ability = this.defineAbilityFor();

    return ability.can(action, subject('user', user));
  }

  // eslint-disable-next-line class-methods-use-this
  private defineAbilityFor () {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    can('create', 'user', {
      role: {
        $eq: 'admin'
      }
    });

    return build();
  }
}
