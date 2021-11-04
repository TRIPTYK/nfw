import { BaseEntity, FilterQuery, QueryFlag, wrap } from '@mikro-orm/core';
import { EntityRepository, QueryBuilder } from '@mikro-orm/mysql';
import { ValidatedJsonApiQueryParams } from '../decorators/json-api-params.js';

export class JsonApiRepository<T> extends EntityRepository<T> {
  public jsonApiRequest (params : ValidatedJsonApiQueryParams) {
    const transformedModelName = (this.entityName as string).replace('Model', '').toLowerCase();
    const queryBuilder = this.createQueryBuilder(transformedModelName);

    if (params.include?.length) {
      this.handleIncludes(queryBuilder, params.include, []);
    }

    if (params.sort?.length) {
      this.handleSorting(queryBuilder, params.sort);
    }

    if (params.fields && Object.keys(params.fields).length > 0) {
      this.handleSparseFields(queryBuilder, params.fields);
    } else {
      queryBuilder.select('*');
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

  private handleSparseFields (queryBuilder: QueryBuilder<T>, fields: Record<string, string[] | Record<string, string[]>>) {
    if (fields.$$default) {
      queryBuilder.addSelect(fields.$$default as string[]);
      return;
    }

    for (const [key, value] of Object.entries(fields)) {
      if (Array.isArray(value)) {
        queryBuilder.addSelect(value.map(e => `${key}.${e}`));
      } else {
        this.handleSparseFields(queryBuilder, value);
      }
    }
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

        queryBuilder.leftJoin(rootInclude, included?.concat([rootInclude]).join('-') ?? rootInclude);
        included?.push(rootInclude);
        this.handleIncludes(queryBuilder, rest, included, relationMeta.entity() as any);
      }
    }
  }

  public async jsonApiCreate (model: Partial<T>): Promise<T> {
    const entity = this.create(model);
    await this.persistAndFlush(entity);
    return entity;
  }

  public async jsonApiUpdate (model: Partial<T>, filterQuery:FilterQuery<T>): Promise<T> {
    const entity = await this.findOneOrFail(filterQuery, ['articles']);
    await wrap(entity).assign(model);
    await this.persistAndFlush(entity);
    return entity;
  }
}
