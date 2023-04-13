import type { RouterContext } from '@koa/router';
import type { Schema } from 'yup';

export function validate<T extends RouterContext> (schema: Schema, context: T, key: keyof T) {
  return schema.validate(context.ctx.request[key], {
    abortEarly: false
  });
}
