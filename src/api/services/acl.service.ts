import { subject } from '@casl/ability';
import type { AnyEntity, EntityDTO } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import type { SqlEntityManager } from '@mikro-orm/mysql';
import type { UserModel } from '../models/user.model.js';
import * as abilities from '@casl/ability/extra'; // must use all because jest error
import createHttpError from 'http-errors';
import { ConfigurationService } from './configuration.service.js';
import type { permittedFieldsOf } from '@casl/ability/extra';
import { injectable, singleton, inject } from '@triptyk/nfw-core';
import type { Class } from 'type-fest';
import { modelToName } from '../utils/model-to-name.js';

@injectable()
@singleton()
export class AclService {
  
  public constructor (@inject(MikroORM) public databaseConnection: MikroORM, @inject(ConfigurationService) private configService: ConfigurationService) {}

  public async can<T extends AnyEntity<T>> (ability: Class<T>, sub: UserModel | null | undefined, act: 'create' | 'update' | 'delete' | 'read', obj: EntityDTO<T> | T) {
    try {
      await this.enforce(ability, sub, act, obj);
      return true;
    } catch (e) {
      return false;
    }
  }

  public async enforce<T extends AnyEntity> (entity: Class<T>, sub: UserModel | null | undefined, act: 'create' | 'update' | 'delete' | 'read', obj: EntityDTO<T> | T) {
    const transformedModelName = modelToName(entity.name, false);
    const subjectAlias = subject(transformedModelName,
      obj);

    /**
     * Get sql entityManager of current request
     */
    const contextEntityManager = this.databaseConnection.em.getContext() as SqlEntityManager;

    /**
     * Preload ability
     */
    // eslint-disable-next-line dot-notation
    const loadedAbility = await (entity as any).ability(sub, obj as T, contextEntityManager);

    /**
     * Find attributes in entity metadatas
     */
    const perms = contextEntityManager.getMetadata().find(entity.name);

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
      throw createHttpError(403, `Cannot ${act} ${transformedModelName} ${(obj as Partial<any>).id ?? '#'} as ${userRole}`);
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
