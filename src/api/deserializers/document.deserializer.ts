import type { Resource } from '@triptyk/nfw-jsonapi';
import { ResourceDeserializer } from '@triptyk/nfw-jsonapi/dist/src/deserializers/resource.deserializer.js';
import type { JsonApiContext } from '@triptyk/nfw-jsonapi/dist/src/interfaces/json-api-context.js';
import type formidable from 'formidable';
import type { DocumentModel } from '../models/document.model.js';

export class DocumentDeserializer extends ResourceDeserializer<DocumentModel> {
  async deserialize (payload: Record<string, unknown>, context: JsonApiContext<DocumentModel, Resource<DocumentModel>>): Promise<Resource<DocumentModel>> {
    const file = context.koaContext.request.files?.file as formidable.File;
    payload.data = {
      id: payload?.id,
      attributes: {
        ...payload,
        ...{
          filename: file.newFilename,
          originalName: file.originalFilename,
          path: file.filepath,
          mimetype: file.mimetype,
          size: file.size,
        },
      },
    };
    return super.deserialize(payload, context);
  }
}
