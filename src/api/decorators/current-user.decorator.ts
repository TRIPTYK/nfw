import { container } from '@triptyk/nfw-core';
import { createCustomDecorator } from '@triptyk/nfw-http';
import { UserService } from '../services/user.service.js';

export function CurrentUser () {
  return createCustomDecorator(async ({ ctx }) => {
    const userService = container.resolve(UserService);

    const user = await userService.tryLoadUserFromToken(ctx.headers.authorization ?? '');

    return user;
  }, 'current-user');
}
