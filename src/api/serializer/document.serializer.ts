import { inject, injectable, singleton } from '@triptyk/nfw-core';
import { BaseJsonApiSerializer } from '../../json-api/serializer/base.serializer.js';
import { DocumentModel } from '../models/document.model.js';
import { ConfigurationService } from '../services/configuration.service.js';

@injectable()
@singleton()
export class DocumentSerializer extends BaseJsonApiSerializer<DocumentModel> {
  constructor (
    @inject(ConfigurationService) configurationService: ConfigurationService,
  ) {
    super(configurationService);

    this.serializer.register('documents', {
      whitelist: ['filename', 'originalName', 'mimetype', 'path', 'size'],
      relationships: {
        users: {
          type: 'users',
        },
      },
    });

    this.serializer.register('users', {
      whitelist: ['firstName', 'lastName', 'email'],
    });
  }

  serialize (data: any) {
    return this.serializer.serializeAsync('documents', data);
  }
}
