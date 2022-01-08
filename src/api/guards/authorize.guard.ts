import { GuardInterface, injectable } from '@triptyk/nfw-core';
import { CurrentUser } from '../decorators/current-user.js';
import { Roles } from '../enums/roles.enum.js';
import { UserModel } from '../models/user.model.js';

@injectable()
export class AuthorizeGuard implements GuardInterface {
  can (@CurrentUser() user: UserModel | undefined): boolean {
    return user?.role === Roles.ADMIN;
  }
}
