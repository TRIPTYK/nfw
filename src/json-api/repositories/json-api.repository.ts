import { BaseEntity, QueryFlag } from '@mikro-orm/core';
import { EntityRepository, QueryBuilder } from '@mikro-orm/mysql';
import { UserModel } from '../../api/models/user.model.js';

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
  public jsonApiRequest (params : JsonApiParams, accessedBy: UserModel | null) {
    const queryBuilder = this.createQueryBuilder();

    queryBuilder.select('*');

    if (params.include?.length) {
      this.handleIncludes(queryBuilder, params.include, [], accessedBy);
    }

    queryBuilder.setFlag(QueryFlag.PAGINATE)
      .offset(params.page?.number)
      .limit(params.page?.size ?? 10);

    return queryBuilder;
  }

  private handleIncludes (queryBuilder: QueryBuilder<T>, includes: string[], included: string[], accessedBy: UserModel | null, parentEntity?: BaseEntity<any, any>) {
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

        const baseClass = entityMeta?.class as any;

        console.log(`${rootInclude}Conditions`);

        console.log(baseClass[`${rootInclude}Conditions`]);

        queryBuilder.leftJoinAndSelect(rootInclude, included?.concat([rootInclude]).join('-') ?? rootInclude, baseClass[`${rootInclude}Conditions`]?.(accessedBy, rootInclude, queryBuilder));
        included?.push(rootInclude);
        this.handleIncludes(queryBuilder, rest, included, accessedBy, relationMeta.entity() as any);
      }
    }
  }
}
