import { ArticleModel } from '../models/article.model.js';
import { UserModel } from '../models/user.model.js';
import { AccessPermisions, baseAbilityFor, EntityAbility } from './base.js';

const userAccessPermissions: AccessPermisions = {
  admin: (user, { can }) => {
    can('manage', 'all');
  },
  user: (user, { can }) => {
    can('manage', 'all');
  },
  anonymous: (_, { can }) => {

  },
}

/**
 * @param userReq the use who emits the request
 * @param user the target
 */
export const defineAbilityForArticle: EntityAbility<ArticleModel> = async (userReq: UserModel | undefined | null, entity) => {
  return baseAbilityFor(userReq, userAccessPermissions);
}
