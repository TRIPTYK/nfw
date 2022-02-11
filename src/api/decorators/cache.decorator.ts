import { createCustomDecorator } from '@triptyk/nfw-core';

/**
 * Get an already used param decorator response, returns undefined if not found
 */
export function Cache (decoratorName: string) {
  return createCustomDecorator(async ({ sharedParams }) => {
    const key = Object.keys(sharedParams).find((key) => key.split('_')[0] === decoratorName);
    if (!key) return undefined;
    return sharedParams[key];
  }, 'cache', false);
}
