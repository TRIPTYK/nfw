import { subject } from '@casl/ability';
import type { AnyEntity, MikroORM } from '@mikro-orm/core';
import type { SqlEntityManager } from '@mikro-orm/mysql';
import { databaseInjectionToken, inject, injectable, singleton } from '@triptyk/nfw-core';
import type { EntityAbility } from '../abilities/base.js';
import type { UserModel } from '../models/user.model.js';
import * as abilities from '@casl/ability/extra'; // must use all because jest error
import { modelToName } from '../../json-api/utils/model-to-name.js';
import createHttpError from 'http-errors';
import type { JsonApiModelInterface } from '../../json-api/interfaces/model.interface.js';
import { ConfigurationService } from './configuration.service.js';
import type { permittedFieldsOf } from '@casl/ability/extra';

@injectable()
@singleton()
export class AclService {
  // eslint-disable-next-line no-useless-constructor
  public constructor (@inject(databaseInjectionToken) public databaseConnection: MikroORM, @inject(ConfigurationService) private configService: ConfigurationService) {}

  public async can<T extends AnyEntity<T>> (ability: EntityAbility<T>, sub: UserModel | null | undefined, act: 'create' | 'update' | 'delete' | 'read', obj: AnyEntity) {
    try {
      await this.enforce(ability, sub, act, obj);
      return true;
    } catch (e) {
      return false;
    }
  }

  public async enforce<T extends AnyEntity> (ability: EntityAbility<T>, sub: UserModel | null | undefined, act: 'create' | 'update' | 'delete' | 'read', obj: AnyEntity) {
    const transformedModelName = modelToName(obj, false);
    const subjectAlias = subject(transformedModelName,
      obj);

    /**
     * Get sql entityManager of current request
     */
    const contextEntityManager = this.databaseConnection.em.getContext() as SqlEntityManager;

    /**
     * Preload ability
     */
    const loadedAbility = await ability(sub, obj as T, contextEntityManager);

    /**
     * Find attributes in entity metadatas
     */
    const perms = contextEntityManager.getMetadata().find(obj.constructor.name);

    if (!perms) { throw Error(`Metadata not found for ${obj}`); }

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
     * permittedFieldsOf seems to be transformed when using jest, we must fix it manually in code
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const permittedFix : typeof permittedFieldsOf = this.configService.getKey('env', 'development') === 'test' ? (abilities as any).default.permittedFieldsOf : abilities.permittedFieldsOf;

    /**
     * Check fields permissions
     */
    const permitted = permittedFix(loadedAbility, act, obj, { fieldsFrom: (rule) => rule.fields || defaultProps.map((e) => e.name) });

    /**
     * Find not allowed keys in object's attributes
     */
    const forbiddenKeys = Object.entries(obj).filter(([key]) => withoutRelations.includes(key)).filter(([key]) => !permitted.includes(key));

    if (forbiddenKeys.length) {
      const forbiddenKeysNames = forbiddenKeys.map(([key]) => key);
      throw createHttpError(403, `Cannot access ${forbiddenKeysNames} of ${transformedModelName}`);
    }
  }
}
