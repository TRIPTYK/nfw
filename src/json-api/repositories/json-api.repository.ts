import { FilterQuery, LoadStrategy, wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { UserModel } from '../../api/models/user.model.js';
import { dotToObject } from '../../api/utils/dot-to-object.js';
import { ValidatedJsonApiQueryParams } from '../decorators/json-api-params.js';
import { SortObject } from '../parser/parse-includes.js';
import { modelToName } from '../utils/model-to-name.js';

export abstract class JsonApiRepository<T> extends EntityRepository<T> {
  public jsonApiFindOne (idConditions: Record<string, unknown>, params : ValidatedJsonApiQueryParams) {
    return this.findOneOrFail(idConditions, this.getFindOptionsFromParams(params));
  }

  public jsonApiFind (params : ValidatedJsonApiQueryParams, user?: UserModel) {
    if (params.page) {
      return this.findAndCount(params.filters, this.getFindOptionsFromParams(params, user));
    }
    return this.find(params.filters, this.getFindOptionsFromParams(params, user));
  }

  private getFindOptionsFromParams (params : ValidatedJsonApiQueryParams, user?: UserModel) {
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

    console.log(`${user?.role ?? 'anonymous'}_access`)
    return {
      fields,
      disableIdentityMap: true,
      populate: params.include ?? [],
      strategy: LoadStrategy.SELECT_IN,
      limit: size,
      filters: {
        [`${user?.role ?? 'anonymous'}_access`]: { user },
      },
      orderBy,
      offset: params.page?.number ? params.page.number * size : undefined,
    }
  }

  public async jsonApiCreate (model: Partial<T>): Promise<T> {
    const entity = this.create(model);
    await this.persistAndFlush(entity);
    return entity;
  }

  public async jsonApiUpdate (model: Partial<T>, filterQuery:FilterQuery<T>): Promise<T> {
    const entity = await this.findOneOrFail(filterQuery);
    await wrap(entity).assign(model);
    await this.persistAndFlush(entity);
    return entity;
  }

  public async jsonApiRemove (filterQuery:FilterQuery<T>): Promise<undefined> {
    const entity = await this.findOneOrFail(filterQuery);
    await this.removeAndFlush(entity);
    return undefined;
  }
}
