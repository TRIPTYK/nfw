import { EntityRepository, QueryBuilder } from '@mikro-orm/mysql';

export interface JsonApiParams {
    include: string[],
    sort: string[],
    fields: string[],
    filters: Record<string, string[]>,
}

export class JsonApiRepository<T> extends EntityRepository<T> {
  public jsonApiRequest (params : JsonApiParams) {
    const queryBuilder = this.createQueryBuilder();

    queryBuilder.select('*');

    if (params.include.length) {
      this.handleIncludes(queryBuilder, params.include);
    }

    return queryBuilder;
  }

  private handleIncludes (queryBuilder: QueryBuilder<T>, includes: string[]) {
    for (const includePath of includes) {
      queryBuilder.leftJoinAndSelect(includePath, includePath.toUpperCase());
    }
  }
}
