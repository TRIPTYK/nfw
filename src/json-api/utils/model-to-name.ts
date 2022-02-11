import type { AnyEntity, EntityName } from '@mikro-orm/core';
import { paramCase } from 'param-case';
import pluralize from 'pluralize';

/**
 * Transforms model name to json-api entity name
 */
export function modelToName<T> (model: AnyEntity<T> | EntityName<T>, pluralizeName: boolean = true) {
  let name = typeof model === 'string' ? model.replace('Model', '') : model.constructor.name.replace('Model', '');

  if (pluralizeName) {
    name = pluralize(name);
  }

  return paramCase(name);
}
