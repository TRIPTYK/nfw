
import { Attribute, JsonApiResource, Resource } from '@triptyk/nfw-jsonapi';
import { DocumentDeserializer } from '../deserializers/document.deserializer.js';
import type { MimeTypes } from '../enums/mime-type.enum.js';
import { DocumentModel } from '../models/document.model.js';
import { DocumentResourceService } from '../services/documents.service.js';

@JsonApiResource({
  entity: DocumentModel,
  entityName: 'documents',
  deserializer: DocumentDeserializer,
  service: DocumentResourceService
})
export class DocumentResource extends Resource<DocumentModel> {
  @Attribute({
    filterable: false,
    sortable: ['ASC', 'DESC']
  })
  declare id: string;

  @Attribute()
  declare filename: string;

  @Attribute()
  declare originalName: string;

  @Attribute()
  declare path: string;

  @Attribute()
  declare mimetype: MimeTypes;

  @Attribute()
  declare size: number;
}
