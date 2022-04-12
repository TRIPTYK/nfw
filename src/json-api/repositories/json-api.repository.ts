import type { Dictionary, EntityData, EntityDTO, FilterQuery, FindOptions, Loaded, QueryOrderMap, RequiredEntityData } from '@mikro-orm/core';
import { ReferenceType, LoadStrategy, wrap } from '@mikro-orm/core';
import type { AutoPath } from '@mikro-orm/core/typings';
import { EntityRepository } from '@mikro-orm/mysql';
import type { UserModel } from '../../api/models/user.model.js';
import { dotToObject } from '../../api/utils/dot-to-object.js';
import type { ValidatedJsonApiQueryParams } from '../decorators/json-api-params.js';
import type { SortObject } from '../parser/parse-includes.js';
import { modelToName } from '../utils/model-to-name.js';

export abstract class JsonApiRepository<T> extends EntityRepository<T> {
  public jsonApiFindOne (idConditions: FilterQuery<T>, params : ValidatedJsonApiQueryParams, user?: UserModel) {
    return this.findOneOrFail(idConditions, this.getFindOptionsFromParams(params, user));
  }

  public jsonApiFind (params : ValidatedJsonApiQueryParams, user?: UserModel) {
    const filters = (params.filter ?? {}) as FilterQuery<T>;
    if (params.page) {
      return this.findAndCount(filters, this.getFindOptionsFromParams(params, user));
    }
    return this.find(filters, this.getFindOptionsFromParams(params, user));
  }

  private getFindOptionsFromParams (params : ValidatedJsonApiQueryParams, user?: UserModel): FindOptions<T, never> {
    const entityName = modelToName(this.entityName);
    const size = Math.min(params.page?.size ?? 10, 30);

    /**
     * Do not specify root entity, remove it
     */
    const fields = params.fields?.map((field) => field.startsWith(`${entityName}.`) ? field.replace(`${entityName}.`, '') : field) ?? [];

    const minimumFields = [...params.include?.map((i) => `${i}.id`) ?? [], 'id'];

    /**
     * Transform into nested object with order specified
     */
    const orderBy = params.sort?.reduce((p, c) => p = { ...p, ...dotToObject(c) as SortObject }, {} as SortObject);

    const findOptions = {
      fields: [...fields, ...minimumFields] as (keyof T)[],
      disableIdentityMap: true,
      populate: params.include as AutoPath<T, never>[],
      strategy: LoadStrategy.SELECT_IN,
      limit: size,
      filters: this.getFiltersForUser(user) as Dictionary<boolean | Dictionary>,
      orderBy: orderBy as QueryOrderMap<T>,
      offset: params.page?.number ? (params.page.number * size) - 1 : undefined,
    } as FindOptions<T, never>;

    return findOptions;
  }

  public getFiltersForUser (user?: UserModel) {
    return {
      [`${user?.role ?? 'anonymous'}_access`]: { user },
    };
  }

  public async jsonApiCreate (model: RequiredEntityData<T>): Promise<T> {
    const entity = this.create(model);
    await this.persistAndFlush(entity);
    return entity as T;
  }

  public async jsonApiUpdate (model: EntityData<Loaded<T, never>> | Partial<EntityDTO<Loaded<T, never>>>, filterQuery:FilterQuery<T>, user?: UserModel): Promise<T> {
    const entity = await this.findOneOrFail(filterQuery, {
      filters: this.getFiltersForUser(user),
    });
    wrap(entity).assign(model);
    await this.persistAndFlush(entity);
    return entity as T;
  }

  public async jsonApiRemove (filterQuery:FilterQuery<T>, user?: UserModel): Promise<undefined> {
    const entity = await this.findOneOrFail(filterQuery, {
      filters: this.getFiltersForUser(user),
    });
    await this.removeAndFlush(entity);
    return undefined;
  }

  public async jsonApiRelated (relation: string, idConditions: FilterQuery<T>, params : ValidatedJsonApiQueryParams, user?: UserModel) {
    const targetRelation = this.em.getMetadata().find(this.entityName.toString())?.relations.find((r) => r.name === relation);
    if (!targetRelation) {
      throw new Error('Relation does not exists');
    }

    if (targetRelation.reference === ReferenceType.MANY_TO_ONE || targetRelation.reference === ReferenceType.ONE_TO_ONE) {
      return (this.em.getRepository(targetRelation.entity)).jsonApiFindOne({
        [targetRelation.inversedBy]: idConditions,
      }, params, user);
    } else {
      return (this.em.getRepository(targetRelation.entity)).jsonApiFind({
        [targetRelation.inversedBy]: idConditions,
      }, params, user);
    }
  }
}
