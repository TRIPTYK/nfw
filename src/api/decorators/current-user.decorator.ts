import { inject, injectable } from '@triptyk/nfw-core';
import type { ControllerParamsContext, ParamInterface } from '@triptyk/nfw-http';
import { createCustomDecorator } from '@triptyk/nfw-http';
import { UserService } from '../services/user.service.js';

@injectable()
class CurrentUserParam implements ParamInterface<unknown> {
  public constructor (
    @inject(UserService) private userService: UserService
  ) {}

  public async handle ({ ctx }: ControllerParamsContext<unknown>) {
    const user = await this.userService.tryLoadUserFromToken(ctx.headers.authorization ?? '');
    return user;
  }
}

export function CurrentUser () {
  return createCustomDecorator(CurrentUserParam, 'current-user');
}
