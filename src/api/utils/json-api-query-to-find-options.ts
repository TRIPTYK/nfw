import type { FindOptions, QueryOrderMap } from '@mikro-orm/core';
import type { IncludeQuery, JsonApiQuery } from '@triptyk/nfw-resources';
import { offsetFromPageAndSize } from './offset-from-page.js';

type PartialFindOptions<T, P extends string> = Pick<FindOptions<T, P>, 'populate' | 'orderBy' | 'fields' | 'limit' | 'offset'>

type TransformedSortObject<T> = QueryOrderMap<T>;

function transformIncludesQuery (includes: IncludeQuery[]): string[] {
  const transformedIncludes: string[] = [];

  includes.forEach(({ relationName, nested }) => {
    if (nested.length) {
      transformIncludesQuery(nested).forEach(nestedInclude => {
        transformedIncludes.push(`${relationName}.${nestedInclude}`);
      });
    } else {
      transformedIncludes.push(relationName);
    }
  });

  return transformedIncludes;
}

class SortTransformer<T> {
  public constructor (
    private sortObject: Record<string, unknown>
  ) {}

  public toOrderByFindOption (): TransformedSortObject<T> {
    const transformedSortObject: TransformedSortObject<T> = {};

    Object.keys(this.sortObject).forEach((key: string) => {
      this.transformSortObjectKey(key, transformedSortObject);
    });

    return transformedSortObject;
  }

  private transformSortObjectKey (key: string, newSortObject: Record<string, unknown>) {
    const parts = key.split('.');
    let currentObject = newSortObject as TransformedSortObject<T>;

    for (let i = 0; i < parts.length; i++) {
      currentObject = this.transformPart(parts, i, currentObject, key);
    }
  }

  private transformPart (parts: string[], i: number, currentObject: TransformedSortObject<T>, key: string) {
    const part = parts[i] as keyof TransformedSortObject<T>;

    if (i === parts.length - 1) {
      currentObject[part] = this.sortObject[key] as never;
    } else {
      if (!currentObject[part]) {
        currentObject[part] = {};
      }

      currentObject = currentObject[part] as never;
    }
    return currentObject;
  }
}

// don't remove PartialFindOptions: https://github.com/mikro-orm/mikro-orm/issues/4258
export function jsonApiQueryToFindOptions<T extends object, P extends string = string> (jsonApiQuery: JsonApiQuery): PartialFindOptions<T, P> {
  return {
    fields: undefined,
    populate: transformIncludesQuery(jsonApiQuery.include ?? []) as unknown as FindOptions<T>['populate'],
    limit: jsonApiQuery.page?.size,
    offset: jsonApiQuery.page ? offsetFromPageAndSize(jsonApiQuery.page.number, jsonApiQuery.page.size) : undefined,
    orderBy: new SortTransformer(jsonApiQuery.sort ?? {}).toOrderByFindOption()
  }
}
