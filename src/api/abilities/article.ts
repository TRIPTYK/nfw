import { ArticleModel } from '../models/article.model.js';
import { UserModel } from '../models/user.model.js';
import { AccessPermisions, baseAbilityFor, EntityAbility } from './base.js';

const userAccessPermissions: AccessPermisions = {
  admin: (user, { can }) => {
    can('manage', 'all');
  },
  user: (user, { can }) => {
    can(['read', 'create', 'update', 'delete'], 'article', {
      'owner.id': user!.id,
    });
  },
  anonymous: (_, { can }) => {

  },
}

/**
 * @param userReq the use who emits the request
 * @param user the target
 */
export const defineAbilityForArticle: EntityAbility<ArticleModel> = async (userReq: UserModel | undefined | null, entity) => {
  // preload relations for ACL
  if (!entity.owner.isInitialized()) {
    await entity.owner.init();
  }

  return baseAbilityFor(userReq, userAccessPermissions);
}
