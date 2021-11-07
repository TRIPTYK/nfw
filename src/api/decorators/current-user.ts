import { MetadataStorage } from '@triptyk/nfw-core';

export function CurrentUser () {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName: propertyKey,
      index,
      handle: (context) => context.ctx.state.user,
    });
  };
}
