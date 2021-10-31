import { QueryFlag } from '@mikro-orm/core';
import { EntityRepository, QueryBuilder } from '@mikro-orm/mysql';

export interface JsonApiParams {
    include?: string[],
    sort?: string[],
    fields?: string[],
    filters?: Record<string, string[]>,
    page?: {
      size: number,
      number: number,
    },
}

export class JsonApiRepository<T> extends EntityRepository<T> {
  public jsonApiRequest (params : JsonApiParams) {
    const queryBuilder = this.createQueryBuilder();

    queryBuilder.select('*');

    if (params.include?.length) {
      this.handleIncludes(queryBuilder, params.include);
    }

    queryBuilder.setFlag(QueryFlag.PAGINATE)
      .offset(params.page?.number)
      .limit(params.page?.size ?? 10);

    return queryBuilder;
  }

  private handleIncludes (queryBuilder: QueryBuilder<T>, includes: string[], included?: string[]) {
    for (const includePath of includes) {
      const includeSplitted = includePath.split('.');
      const rootInclude = includeSplitted.shift();
      const rest = includeSplitted.slice(1);
      if (rootInclude) {
        queryBuilder.leftJoinAndSelect(rootInclude, rest.join('-'));
        this.handleIncludes(queryBuilder, rest, included);
      }
    }
  }
}
