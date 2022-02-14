import { Ability, AbilityBuilder, createAliasResolver } from '@casl/ability';
import type { AnyEntity } from '@mikro-orm/core';
import type { EntityManager } from '@mikro-orm/mysql';
import type { Roles } from '../enums/roles.enum.js';
import type { UserModel } from '../models/user.model.js';

type DefinePermissions = (user: UserModel | null | undefined, builder: AbilityBuilder<Ability>) => void;
export type AccessPermisions = Record<Roles | 'anonymous', DefinePermissions>;
export type EntityAbility<T extends AnyEntity> = (userReq: UserModel | undefined | null, entity: T, entityManager: EntityManager) => Promise<Ability>;

const resolveAction = createAliasResolver({
  list: ['read'],
  get: ['read'],
});

export const baseAbilityFor = (userReq: UserModel | undefined | null, accessPermisions: AccessPermisions) => {
  const builder = new AbilityBuilder(Ability);
  const role = userReq?.role ?? 'anonymous';

  if (typeof accessPermisions[role] === 'function') {
    accessPermisions[role](userReq, builder);
    return builder.build({ resolveAction });
  }

  throw new Error(`Unknown role ${role}`);
};
