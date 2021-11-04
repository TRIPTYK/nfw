import { LoadStrategy } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { dotToObject } from '../../api/utils/dot-to-object.js';
import { ValidatedJsonApiQueryParams } from '../decorators/json-api-params.js';
import { SortObject } from '../parser/parse-includes.js';

export class JsonApiRepository<T> extends EntityRepository<T> {
  get jsonApiEntityName () {
    return (this.entityName as string).replace('Model', '').toLowerCase();
  }

  public jsonApiFindOne (idConditions: Record<string, unknown>, params : ValidatedJsonApiQueryParams) {
    return this.findOneOrFail(idConditions, this.getFindOptionsFromParams(params));
  }

  public jsonApiFind (params : ValidatedJsonApiQueryParams) {
    return this.find({}, this.getFindOptionsFromParams(params));
  }

  private getFindOptionsFromParams (params : ValidatedJsonApiQueryParams) {
    const size = Math.min(params.page?.size ?? 10, 30);

    /**
     * Do not specify root entity, remove it
     */
    const fields = params.fields?.map((field) => field.startsWith(`${this.jsonApiEntityName}.`) ? field.replace(`${this.jsonApiEntityName}.`, '') : field);

    /**
     * Transform into nested object with order specified
     */
    const orderBy = params.sort?.reduce((p, c) => p = { ...p, ...dotToObject(c) as SortObject }, {} as SortObject);

    return {
      fields,
      disableIdentityMap: true,
      populate: params.include ?? [],
      strategy: LoadStrategy.SELECT_IN,
      limit: size,
      orderBy,
      offset: params.page?.number ? params.page.number * size : undefined,
    }
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
