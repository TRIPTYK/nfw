
import { injectable } from '@triptyk/nfw-core';
import type { GuardInterface } from '@triptyk/nfw-http';
import { Args } from '@triptyk/nfw-http';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import type { UserModel } from '../models/user.model.js';

@injectable()
export class AuthorizeGuard implements GuardInterface {
  can (@CurrentUser() user: UserModel | undefined, @Args() roles: string[]): boolean {
    if (user && roles.length === 0) {
      return true;
    }
    return roles.includes(user?.role ?? '');
  }

  code = 401;
}
