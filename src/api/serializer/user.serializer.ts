import { injectable, singleton } from '@triptyk/nfw-core';
import { BaseJsonApiSerializer } from '../../json-api/serializer/base.serializer.js';
import type { UserModel } from '../models/user.model.js';
import type { DocumentModel } from '../models/document.model';
import { DocumentSerializer } from './document.serializer.js';

@injectable()
@singleton()
export class UserSerializer extends BaseJsonApiSerializer<UserModel> {
  public static entityName = 'user';

  constructor () {
    super();
    this.serializer.register(UserSerializer.entityName, {
      whitelist: ['firstName', 'lastName'] as (keyof UserModel)[],
      relationships: {
        documents: {
          type: DocumentSerializer.entityName,
        },
      },
    });
    this.serializer.register(DocumentSerializer.entityName, {
      whitelist: ['filename', 'mimetype', 'originalName', 'path', 'size'] as (keyof DocumentModel)[],
    });
  }

  serialize (
    data: UserModel[] | UserModel,
    extraData?: Record<string, unknown>,
  ) {
    return this.serializer.serializeAsync(
      UserSerializer.entityName,
      data,
      extraData ?? ({} as any),
    );
  }
}
