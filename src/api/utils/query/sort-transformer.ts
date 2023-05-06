import type { QueryOrderMap } from '@mikro-orm/core';

type TransformedSortObject<T> = QueryOrderMap<T>;

export class SortTransformer<T> {
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
