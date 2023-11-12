import { Factory } from '@mikro-orm/seeder';
import { MimeTypes } from '../enums/mime-type.enum.js';
import { DocumentModel } from '../models/document.model.js';

export class DocumentFactory extends Factory<DocumentModel> {
  model = DocumentModel;

  definition (): Partial<DocumentModel> {
    return {
      filename: 'upload_1',
      originalName: 'file.png',
      path: 'dist/uploads/upload_1',
      mimetype: MimeTypes.PNG,
      size: 1000
    };
  }
}
