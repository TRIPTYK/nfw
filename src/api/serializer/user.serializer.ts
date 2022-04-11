import { inject, injectable, singleton } from '@triptyk/nfw-core';
import { BaseJsonApiSerializer } from '../../json-api/serializer/base.serializer.js';
import type { UserModel } from '../models/user.model.js';
import type { DocumentModel } from '../models/document.model';
import { DocumentSerializer } from './document.serializer.js';
import { ConfigurationService } from '../services/configuration.service.js';
import type { AnyEntity } from '@mikro-orm/core';

@injectable()
@singleton()
export class UserSerializer extends BaseJsonApiSerializer<UserModel> {
  public static entityName = 'user';

  constructor (
     @inject(ConfigurationService) private configurationService: ConfigurationService,
  ) {
    super();
    this.serializer.register(UserSerializer.entityName, {
      links: (data: unknown) => {
        return { self: `${this.configurationService.getKey('baseURL')}/users/${(data as AnyEntity).id}` };
      },
      whitelist: ['firstName', 'lastName'] as (keyof UserModel)[],
      relationships: {
        documents: {
          type: DocumentSerializer.entityName,
        },
      },
    });
    this.serializer.register(DocumentSerializer.entityName, {
      whitelist: ['filename', 'mimetype', 'originalName', 'path', 'size'] as (keyof DocumentModel)[],
      links: (data: unknown) => {
        return { self: `${this.configurationService.getKey('baseURL')}/documents/${(data as AnyEntity).id}` };
      },
    });
  }

  serialize (
    data: UserModel[] | UserModel,
    extraData?: Record<string, unknown>,
  ) {
    return this.serializer.serializeAsync(
      UserSerializer.entityName,
      Array.isArray(data) ? data.map(d => d.toJSON()) : data.toJSON(),
      extraData ?? ({} as any),
    );
  }
}
