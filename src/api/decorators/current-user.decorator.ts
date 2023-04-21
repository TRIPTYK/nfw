import { createCustomDecorator } from '@triptyk/nfw-http';

export function CurrentUser () {
  return createCustomDecorator(({ ctx }) => {
    return ctx.state.user;
  }, 'current-user');
}
