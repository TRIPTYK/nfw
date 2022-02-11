import { inject, injectable, singleton } from '@triptyk/nfw-core';
import { BaseJsonApiSerializer } from '../../json-api/serializer/base.serializer.js';
import type { DocumentModel } from '../models/document.model.js';
import { ConfigurationService } from '../services/configuration.service.js';
import type { UserModel } from '../models/user.model';

@injectable()
@singleton()
export class DocumentSerializer extends BaseJsonApiSerializer<DocumentModel> {
  constructor (
    @inject(ConfigurationService) configurationService: ConfigurationService,
  ) {
    super(configurationService);

    this.serializer.register('documents', {
      whitelist: ['filename', 'originalName', 'mimetype', 'path', 'size'] as (keyof DocumentModel)[],
      relationships: {
        users: {
          type: 'users',
        },
      },
    });

    this.serializer.register('users', {
      whitelist: ['firstName', 'lastName', 'email'] as (keyof UserModel)[],
    });
  }

  serialize (
    data: DocumentModel[] | DocumentModel,
    extraData?: Record<string, unknown>,
  ) {
    return this.serializer.serializeAsync('documents', data, extraData ?? ({} as any));
  }
}
