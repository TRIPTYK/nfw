import { UserModel } from '../models/user.model.js';
import { AccessPermisions, baseAbilityFor, EntityAbility } from './base.js';

const userAccessPermissions: AccessPermisions = {
  admin: (user, { can }) => {
    can('manage', 'all');
  },
  user: (user, { can }) => {
    can('create', 'user', ['id', 'password', 'lastName', 'firstName', 'email']);
    can('delete', 'user', {
      owner: user,
    })
  },
  anonymous: (_, { can }) => {
    can('read', 'user');
    can('get', 'user');
  },
}

/**
 * @param userReq the use who emits the request
 * @param user the target
 */
export const defineAbilityForUser: EntityAbility<UserModel> = async (userReq: UserModel | undefined | null) => {
  return baseAbilityFor(userReq, userAccessPermissions);
}
