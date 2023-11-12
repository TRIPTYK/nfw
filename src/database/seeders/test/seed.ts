import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { MimeTypes } from '../../../features/users/enums/mime-type.enum.js';
import { DocumentFactory } from '../../../features/users/factories/document.factory.js';

export const dummyDocument = {
  id: 'document',
  filename: 'filename.bmp',
  originalName: 'originalName.bmp',
  mimetype: MimeTypes.BMP,
  size: 8001,
  path: 'filename.bmp',
}

export const deleteDummyDocument = {
  id: 'delete-document',
  filename: 'delete-filename.bmp',
  originalName: 'delete-original-name.bmp',
  mimetype: MimeTypes.BMP,
  size: 1337,
  path: './delete-filename.bmp',
}

/**
 * This is the default seeder for this environment
 */
export class DocumentsControllerTestSeeder extends Seeder {
  async run (em: EntityManager): Promise<void> {
    new DocumentFactory(em).makeOne(dummyDocument);
    new DocumentFactory(em).makeOne(deleteDummyDocument);
  }
}
