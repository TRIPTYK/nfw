import { createCustomDecorator } from '@triptyk/nfw-core';

export function File (name: string) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.request.files?.[name];
  }, 'file', false, [name]);
}
