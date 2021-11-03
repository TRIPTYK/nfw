import { BaseEntity, QueryFlag } from '@mikro-orm/core';
import { EntityRepository, QueryBuilder } from '@mikro-orm/mysql';
import { ValidatedJsonApiQueryParams } from '../decorators/json-api-params.js';

export class JsonApiRepository<T> extends EntityRepository<T> {
  public jsonApiRequest (params : ValidatedJsonApiQueryParams) {
    const queryBuilder = this.createQueryBuilder();

    queryBuilder.select('*');

    if (params.include?.length) {
      this.handleIncludes(queryBuilder, params.include, []);
    }

    if (params.sort?.length) {
      this.handleSorting(queryBuilder, params.sort);
    }

    if (params.fields?.length) {
      this.handleSparseFields(queryBuilder, params.fields);
    }

    queryBuilder.setFlag(QueryFlag.PAGINATE)
      .offset(params.page?.number)
      .limit(Math.min(params.page?.size ?? 10, 30)); // by default limit 10

    return queryBuilder;
  }

  private handleSorting (queryBuilder: QueryBuilder<T>, sorts: string[]) {
    for (const sort of sorts) {
      const sortInfos = sort.startsWith('-') ? { field: sort.substring(1), order: 'DESC' } : { field: sort, order: 'ASC' };
      queryBuilder.orderBy({
        [sortInfos.field]: sortInfos.order as 'ASC' | 'DESC',
      });
    }
  }

  private handleSparseFields (queryBuilder: QueryBuilder<T>, fields: string[] | Record<string, unknown>) {
    console.log(fields);
  }

  private handleIncludes (queryBuilder: QueryBuilder<T>, includes: string[], included: string[], parentEntity?: BaseEntity<any, any>) {
    const entityMeta = this.em.getMetadata().find(parentEntity?.constructor.name ?? this.entityName.toString());

    for (const includePath of includes) {
      const includeSplitted = includePath.split('.');
      const rootInclude = includeSplitted.shift();
      const rest = includeSplitted.slice(1);
      if (rootInclude) {
        if (included?.includes(rootInclude)) {
          continue;
        }

        const relationMeta = entityMeta?.relations.find((e) => e.name === rootInclude);

        if (!relationMeta) {
          throw new Error('Relation does not exists');
        }

        queryBuilder.leftJoinAndSelect(rootInclude, included?.concat([rootInclude]).join('-') ?? rootInclude);
        included?.push(rootInclude);
        this.handleIncludes(queryBuilder, rest, included, relationMeta.entity() as any);
      }
    }
  }
}
