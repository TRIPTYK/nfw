import { wrap } from '@mikro-orm/core';

export function toJSONWithType (target: any, type: string) {
  const o = wrap(target, true).toObject();
  return {
    type,
    ...o
  }
}
