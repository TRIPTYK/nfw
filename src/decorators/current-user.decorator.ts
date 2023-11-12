import { inject, injectable } from '@triptyk/nfw-core';
import type { ControllerParamsContext, ParamInterface } from '@triptyk/nfw-http';
import { createCustomDecorator } from '@triptyk/nfw-http';
import { UserService } from '../features/users/services/user.service.js';

@injectable()
class CurrentUserParam implements ParamInterface<void> {
  public constructor (
    @inject(UserService) private userService: UserService
  ) {}

  public async handle ({ ctx }: ControllerParamsContext<void>) {
    return this.userService.tryLoadUserFromToken(ctx.headers.authorization ?? '');
  }
}

export function CurrentUser () {
  return createCustomDecorator(CurrentUserParam, 'current-user');
}
