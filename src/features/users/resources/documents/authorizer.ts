import { defineAbility, subject } from '@casl/ability';
import type { EntityData } from '@mikro-orm/core';
import { singleton } from '@triptyk/nfw-core';
import type { Promisable } from 'type-fest';
import type { DocumentModel } from '../../models/document.model.js';
import type { UserModel } from '../../models/user.model.js';
import { Roles } from '../../enums/roles.enum.js';
import type { AuthorizerAction, ResourceAuthorizer } from '../../../shared/resources/base/authorizer.js';

export type DocumentResourceAuthorizer = ResourceAuthorizer<DocumentModel>;

@singleton()
export class DocumentResourceAuthorizerImpl implements ResourceAuthorizer<DocumentModel> {
  can (actor: UserModel | undefined, action: AuthorizerAction, on: EntityData<DocumentModel>): Promisable<boolean> {
    const ability = this.ability(actor)
    return ability.can(action, subject('document', on));
  }

  private ability (actor: UserModel | undefined) {
    return defineAbility((can) => {
      if (actor === undefined) {
        return;
      }

      can('read', 'document');
      can('create', 'document');

      if (actor.role === Roles.ADMIN) {
        can(['update', 'delete'], 'document');
      }

      can(['update', 'delete'], 'document', {
        users: {
          $elemMatch: {
            id: {
              $eq: actor.id,
            },
          },
        },
      });
    })
  }
}
