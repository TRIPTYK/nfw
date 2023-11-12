import { injectable } from '@triptyk/nfw-core';
import type { GuardInterface } from '@triptyk/nfw-http';
import { Args } from '@triptyk/nfw-http';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import type { UserModel } from '../features/users/models/user.model.js';

@injectable()
export class AuthorizeGuard implements GuardInterface {
  code = 401;

  can (@CurrentUser() user: UserModel | undefined, @Args() roles: string[]): boolean {
    if (user && roles.length === 0) {
      return true;
    }
    return roles.includes(user?.role ?? '');
  }
}
