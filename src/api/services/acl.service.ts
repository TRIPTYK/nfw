import { subject } from '@casl/ability';
import { BaseEntity, MikroORM } from '@mikro-orm/core';
import { databaseInjectionToken, inject, injectable, singleton } from '@triptyk/nfw-core';
import { defineAbilityFor } from '../acl/user.js';
import { UserModel } from '../models/user.model.js';

@injectable()
@singleton()
export class AclService {
  // eslint-disable-next-line no-useless-constructor
  public constructor (@inject(databaseInjectionToken) public databaseConnection: MikroORM) {

  }

  public enforce (sub: UserModel | null, act: 'create' | 'update' | 'delete' | 'read', obj: BaseEntity<any, any>) {
    const ability = defineAbilityFor(sub);
    const transformedModelName = obj.constructor.name.replace('Model', '').toLowerCase();
    const subjectAlias = subject(transformedModelName, obj);

    console.info(sub?.role ?? 'anonymous', act, obj);

    const can = ability.can(act, subjectAlias);

    if (!can) {
      throw new Error(`Cannot ${act} ${transformedModelName} ${(obj as any).id ?? '#'}`);
    }
  }
}
