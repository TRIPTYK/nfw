import { LoadStrategy } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { ValidatedJsonApiQueryParams } from '../decorators/json-api-params.js';

export class JsonApiRepository<T> extends EntityRepository<T> {
  get jsonApiEntityName () {
    return (this.entityName as string).replace('Model', '').toLowerCase();
  }

  public jsonApiRequest (params : ValidatedJsonApiQueryParams) {
    const size = Math.min(params.page?.size ?? 10, 30);

    /**
     * Do not specify root entity
     */
    (params.fields ?? []).forEach((field, idx, arr) => {
      if (field.startsWith(`${this.jsonApiEntityName}.`)) {
        arr[idx] = field.replace(`${this.jsonApiEntityName}.`, '')
      }
    });

    console.log({
      fields: params.fields,
      disableIdentityMap: true,
      populate: params.include ?? [],
      limit: size,
      offset: params.page?.number ? params.page.number * size : undefined,
    }, params.sort)

    return this.find({}, {
      fields: params.fields,
      disableIdentityMap: true,
      populate: params.include ?? [],
      strategy: LoadStrategy.SELECT_IN,
      limit: size,
      orderBy: params.sort,
      offset: params.page?.number ? params.page.number * size : undefined,
    });
  }

  public async jsonApiCreate (model: Partial<T>): Promise<T> {
    try {
      const entity = this.create(model);
      await this.persistAndFlush(entity);
      return entity;
    } catch (e:any) {
      throw new Error(e);
    }
  }
}
