import { injectable } from '@triptyk/nfw-core';
import type { JsonApiContext, NFWAbility, RoleServiceAuthorizer } from '@triptyk/nfw-jsonapi';
import type { UserModel } from '../models/user.model.js';
import { Ability, AbilityBuilder } from '@casl/ability';

interface CurrentContext extends JsonApiContext<any, any> {
  currentUser?: UserModel,
}

@injectable()
export class UserAuthorizer implements RoleServiceAuthorizer<UserModel['role']> {
  public admin (context: CurrentContext, { can }: AbilityBuilder<NFWAbility>) {
    can('manage', 'all');
  };

  public user (context: CurrentContext, { can }: AbilityBuilder<NFWAbility>) {
    can('read', 'users', {
      id: context?.currentUser?.id
    });
    can('update', 'users', {
      id: context?.currentUser?.id
    });
    can('create', 'users');
    can('read', 'documents');
  };

  public anonymous () {}

  public buildAbility (context: CurrentContext) {
    const builder = new AbilityBuilder(Ability<['create' | 'read' | 'update' | 'delete' | 'manage', any]>);
    const role = context?.currentUser?.role ?? 'anonymous';

    if (typeof this[role] === 'function') {
      this[role](context, builder as any);
      return builder.build();
    }

    throw new Error(`Unknown role ${role}`);
  }
}
