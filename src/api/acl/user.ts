import { Ability, AbilityBuilder } from '@casl/ability';
import { Roles } from '../enums/roles.enum.js';
import { UserModel } from '../models/user.model.js';

type DefinePermissions = (user: UserModel | null, builder: AbilityBuilder<Ability>) => void;

const rolePermissions: Record<Roles | 'anonymous', DefinePermissions> = {
  anonymous (user, { can }) {
    can('read', 'user', ['firstName', 'lastName']);
  },
  user (user, { can }) {
    can('read', 'user');
    can(['create', 'update', 'delete'], 'user', {
      id: user!.id,
    });
  },
  admin (user, { can }) {
    can(['read', 'create', 'update', 'delete'], 'all');
  },
};

export function defineAbilityFor (user: UserModel | null) {
  const builder = new AbilityBuilder(Ability);
  const role = user?.role ?? 'anonymous';

  if (typeof rolePermissions[role] === 'function') {
    rolePermissions[role](user, builder);
  } else {
    throw new Error(`Trying to use unknown role "${role}"`);
  }

  return builder.build();
}
