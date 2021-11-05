import { subject } from '@casl/ability';
import { BaseEntity, MikroORM } from '@mikro-orm/core';
import { SqlEntityManager } from '@mikro-orm/mysql';
import { databaseInjectionToken, inject, injectable, singleton } from '@triptyk/nfw-core';
import { EntityAbility } from '../abilities/base.js';
import { UserModel } from '../models/user.model.js';
import { permittedFieldsOf } from '@casl/ability/extra';
import { modelToName } from '../../json-api/utils/model-to-name.js';

@injectable()
@singleton()
export class AclService {
  // eslint-disable-next-line no-useless-constructor
  public constructor (@inject(databaseInjectionToken) public databaseConnection: MikroORM) {}

  public async enforce (ability: EntityAbility<any>, sub: UserModel | null | undefined, act: 'create' | 'update' | 'delete' | 'read', obj: BaseEntity<any, any>) {
    const transformedModelName = modelToName(obj, false);
    const subjectAlias = subject(transformedModelName, obj);

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
    const perms = contextEntityManager.getMetadata().find(obj.constructor.name)!;

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
      throw new Error(`Cannot ${act} ${transformedModelName} ${(obj as any).id ?? '#'} as ${userRole}`);
    }

    /**
     * Check fields permissions
     */
    const permitted = permittedFieldsOf(loadedAbility, 'read', obj, { fieldsFrom: (rule) => rule.fields || defaultProps.map((e) => e.name) });

    /**
     * Find not allowed keys in object's attributes
     */
    const forbiddenKeys = Object.entries(obj).filter(([key]) => withoutRelations.includes(key)).filter(([key]) => !permitted.includes(key));

    if (forbiddenKeys.length) {
      const forbiddenKeysNames = forbiddenKeys.map(([key]) => key);
      throw new Error(`Cannot access ${forbiddenKeysNames} of ${transformedModelName}`)
    }
  }
}
