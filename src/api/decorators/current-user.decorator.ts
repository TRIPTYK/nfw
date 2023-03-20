import { MikroORM } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import { createCustomDecorator } from '@triptyk/nfw-http';
import { loadUserFromContext } from '../middlewares/current-user.middleware.js';
import { UserModel } from '../../database/models/user.model.js';

export function CurrentUser () {
  return createCustomDecorator(async ({ ctx }) => {
    const databaseConnection = container.resolve(MikroORM);
    const user = await loadUserFromContext(ctx, databaseConnection.em.getRepository(UserModel));
    if (!user) {
      throw new Error();
    }
    return user;
  }, 'current-user');
}
