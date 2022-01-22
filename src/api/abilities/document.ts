import { DocumentModel } from '../models/document.model.js';
import { UserModel } from '../models/user.model.js';
import { AccessPermisions, baseAbilityFor, EntityAbility } from './base.js';

const documentAccessPermissions: AccessPermisions = {
  admin: (user, { can }) => {
    can('manage', 'all');
  },
  user: (user, { can }) => {
    can('manage', 'all');
  },
  anonymous: (_, { can }) => {
    can('manage', 'all');
  },
};

/**
 * @param userReq the use who emits the request
 * @param user the target
 */
export const defineAbilityForDocument: EntityAbility<DocumentModel> = async (
  userReq: UserModel | undefined | null,
) => {
  return baseAbilityFor(userReq, documentAccessPermissions);
};
