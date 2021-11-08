import { BaseEntity, FilterQuery, LoadStrategy, wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { dotToObject } from '../../api/utils/dot-to-object.js';
import { ValidatedJsonApiQueryParams } from '../decorators/json-api-params.js';
import { SortObject } from '../parser/parse-includes.js';
import { modelToName } from '../utils/model-to-name.js';

export abstract class JsonApiRepository<T> extends EntityRepository<T> {
  public jsonApiFindOne (idConditions: Record<string, unknown>, params : ValidatedJsonApiQueryParams) {
    return this.findOneOrFail(idConditions, this.getFindOptionsFromParams(params));
  }

  public jsonApiFind (params : ValidatedJsonApiQueryParams) {
    if (params.page) {
      return this.findAndCount(params.filters, this.getFindOptionsFromParams(params));
    }
    return this.find(params.filters, this.getFindOptionsFromParams(params));
  }

  private getFindOptionsFromParams (params : ValidatedJsonApiQueryParams) {
    const entityName = modelToName(this.entityName);
    const size = Math.min(params.page?.size ?? 10, 30);

    /**
     * Do not specify root entity, remove it
     */
    const fields = params.fields?.map((field) => field.startsWith(`${entityName}.`) ? field.replace(`${entityName}.`, '') : field);

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

  public async jsonApiCreate (model: Partial<T> | T): Promise<T> {
    const entity = model instanceof BaseEntity ? model : this.create(model);
    await this.persistAndFlush(entity);
    return entity as T;
  }

  public async jsonApiUpdate (model: Partial<T>, filterQuery:FilterQuery<T> | T): Promise<T> {
    const entity = filterQuery instanceof BaseEntity ? filterQuery : await this.findOneOrFail(filterQuery);
    wrap(entity).assign(model);
    await this.persistAndFlush(entity);
    return entity as T;
  }

  public async jsonApiRemove (filterQuery:FilterQuery<T>): Promise<undefined> {
    const entity = await this.findOneOrFail(filterQuery);
    await this.removeAndFlush(entity);
    return undefined;
  }
}
