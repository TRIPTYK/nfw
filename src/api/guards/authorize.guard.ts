import { ControllerGuardContext, GuardInterface, injectable } from '@triptyk/nfw-core';
import { Roles } from '../enums/roles.enum.js';
import { UserModel } from '../models/user.model.js';

@injectable()
export class AuthorizeGuard implements GuardInterface {
  can (context: ControllerGuardContext): boolean {
    const authorized = context.args[0] as Roles[];

    if (!authorized) {
      throw new Error('Please provide a role to be authorized');
    }

    if (context.ctx.state.user) {
      return authorized.includes((context.ctx.state.user as UserModel).role);
    } else {
      return false;
    }
  }
}
