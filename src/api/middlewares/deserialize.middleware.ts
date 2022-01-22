import { RouterContext } from '@koa/router';
import { Next } from 'koa';

import { Class, container } from '@triptyk/nfw-core';
interface DeserializerInterface {
    deserialize(ctx: unknown): Promise<void>,
}

export const deserialize = <T extends DeserializerInterface>(deserializerClass:Class<T>) => {
  return async (context:RouterContext, next:Next) => {
    const deserializer = container.resolve(deserializerClass);
    const deserializedBody = deserializer.deserialize(context.request.body);
    context.request.body = deserializedBody;
    await next();
  };
};
