import type { AnyEntity } from '@mikro-orm/core';
import { inject, injectable, singleton } from '@triptyk/nfw-core';
import { BaseJsonApiSerializer } from '../../json-api/serializer/base.serializer.js';
import type { DocumentModel } from '../models/document.model.js';
import type { UserModel } from '../models/user.model';
import { ConfigurationService } from '../services/configuration.service.js';
import { UserSerializer } from './user.serializer.js';

@injectable()
@singleton()
export class DocumentSerializer extends BaseJsonApiSerializer<DocumentModel> {
  public static entityName = 'document';

  constructor (
    @inject(ConfigurationService) private configurationService: ConfigurationService,
  ) {
    super();
    this.serializer.register(DocumentSerializer.entityName, {
      whitelist: ['filename', 'originalName', 'mimetype', 'path', 'size'] as (keyof DocumentModel)[],
      links: (data: unknown) => {
        return { self: `${this.configurationService.getKey('baseURL')}/documents/${(data as AnyEntity).id}` };
      },
      relationships: {
        users: {
          type: UserSerializer.entityName,
        },
      },
    });

    this.serializer.register(UserSerializer.entityName, {
      links: (data: unknown) => {
        return { self: `${this.configurationService.getKey('baseURL')}/users/${(data as AnyEntity).id}` };
      },
      whitelist: ['firstName', 'lastName', 'email'] as (keyof UserModel)[],
    });
  }

  serialize (
    data: DocumentModel[] | DocumentModel,
    extraData?: Record<string, unknown>,
  ) {
    return this.serializer.serializeAsync(DocumentSerializer.entityName, Array.isArray(data) ? data.map(d => d.toObject()) : data.toObject(), extraData ?? ({} as any));
  }
}
