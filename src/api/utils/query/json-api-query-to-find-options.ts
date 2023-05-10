import type { FindOptions } from '@mikro-orm/core';
import type { JsonApiQuery } from '@triptyk/nfw-resources';
import { offsetFromPageAndSize } from '../offset-from-page.js';
import { SortTransformer } from './sort-transformer.js';
import { transformIncludesQuery } from './transform-includes-query.js';

type PartialFindOptions<T, P extends string> = Pick<FindOptions<T, P>, 'populate' | 'orderBy' | 'fields' | 'limit' | 'offset' | 'filters'>

// don't remove PartialFindOptions: https://github.com/mikro-orm/mikro-orm/issues/4258
export function jsonApiQueryToFindOptions<T extends object, P extends string = string> (jsonApiQuery: JsonApiQuery): PartialFindOptions<T, P> {
  return {
    filters: (jsonApiQuery.filter ?? {}) as never,
    populate: transformIncludesQuery(jsonApiQuery.include ?? []) as unknown as FindOptions<T>['populate'],
    limit: jsonApiQuery.page?.size,
    offset: jsonApiQuery.page ? offsetFromPageAndSize(jsonApiQuery.page.number, jsonApiQuery.page.size) : undefined,
    orderBy: new SortTransformer(jsonApiQuery.sort ?? {}).toOrderByFindOption()
  }
}
