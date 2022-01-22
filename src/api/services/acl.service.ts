import { subject } from '@casl/ability';
import { BaseEntity, MikroORM } from '@mikro-orm/core';
import { SqlEntityManager } from '@mikro-orm/mysql';
import { databaseInjectionToken, inject, injectable, singleton } from '@triptyk/nfw-core';
import { EntityAbility } from '../abilities/base.js';
import { UserModel } from '../models/user.model.js';
import { permittedFieldsOf } from '@casl/ability/extra';
import { modelToName } from '../../json-api/utils/model-to-name.js';
import createHttpError from 'http-errors';
import { JsonApiModelInterface } from '../../json-api/interfaces/model.interface.js';

interface UnknownObject {
  name : string,
  body : Record<string, unknown>,
}

@injectable()
@singleton()
export class AclService {
  // eslint-disable-next-line no-useless-constructor
  public constructor (@inject(databaseInjectionToken) public databaseConnection: MikroORM) {}

  public async can (ability: EntityAbility<any>, sub: UserModel | null | undefined, act: 'create' | 'update' | 'delete' | 'read', obj: BaseEntity<any, any> | UnknownObject) {
    try {
      await this.enforce(ability, sub, act, obj);
      return true;
    } catch (e) {
      return false;
    }
  }

  public async enforce (ability: EntityAbility<any>, sub: UserModel | null | undefined, act: 'create' | 'update' | 'delete' | 'read', obj: BaseEntity<any, any> | UnknownObject) {
    const transformedModelName = modelToName(obj instanceof BaseEntity ? obj : obj.name, false);
    const subjectAlias = subject(transformedModelName,
      obj instanceof BaseEntity ? obj : obj.body);

    /**
     * Get sql entityManager of current request
     */
    const contextEntityManager = this.databaseConnection.em.getContext() as SqlEntityManager;

    /**
     * Preload ability
     */
    const loadedAbility = await ability(sub, obj, contextEntityManager);

    /**
     * Find attributes in entity metadatas
     */
    const perms = contextEntityManager.getMetadata().find(obj instanceof BaseEntity ? obj.constructor.name : obj.name);

    if (!perms) { throw Error(`Metadata not found for ${obj}`) }

    /**
     * Get all fields of entity
     */
    const defaultProps = Object.values(perms.properties);
    const withoutRelations = defaultProps.filter((e) => e.joinColumns === undefined).map(e => e.name);

    /**
     * Check permissions
     */
    const can = loadedAbility.can(act, subjectAlias);
    const userRole = sub?.role ?? 'anonymous';

    if (!can) {
      throw createHttpError(403, `Cannot ${act} ${transformedModelName} ${(obj as Partial<JsonApiModelInterface>).id ?? '#'} as ${userRole}`);
    }

    /**
     * Check fields permissions
     */
    const permitted = permittedFieldsOf(loadedAbility, act, obj, { fieldsFrom: (rule) => rule.fields || defaultProps.map((e) => e.name) });

    /**
     * Find not allowed keys in object's attributes
     */
    const forbiddenKeys = Object.entries(obj).filter(([key]) => withoutRelations.includes(key)).filter(([key]) => !permitted.includes(key));

    if (forbiddenKeys.length) {
      const forbiddenKeysNames = forbiddenKeys.map(([key]) => key);
      throw createHttpError(403, `Cannot access ${forbiddenKeysNames} of ${transformedModelName}`)
    }
  }
}
