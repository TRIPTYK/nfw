import type { MikroORM } from '@mikro-orm/core';
import { container, createCustomDecorator, databaseInjectionToken } from '@triptyk/nfw-core';
import { loadUserFromContext } from '../middlewares/current-user.middleware.js';
import { UserModel } from '../models/user.model.js';

export function CurrentUser () {
  return createCustomDecorator(async ({ ctx }) => {
    const databaseConnection = container.resolve<MikroORM>(databaseInjectionToken);
    return loadUserFromContext(ctx, databaseConnection.em.getRepository(UserModel));
  }, 'current-user', true);
}
