import { MikroORM } from '@mikro-orm/core';
import { container, registry } from '@triptyk/nfw-core';
import { beforeAll, expect } from 'vitest';
import { DocumentsController } from '../../../../../src/api/controllers/documents.controller.js';
import { MimeTypes } from '../../../../../src/api/enums/mime-type.enum.js';
import { Roles } from '../../../../../src/api/enums/roles.enum.js';
import { UserModel } from '../../../../../src/database/models/user.model.js';
import { generateFile } from '../../../../utils/generate-file.js';
import { testCtx } from '../../../../utils/it-request-context.js';
import { setupIntegrationTest } from '../../../../utils/setup-integration-test.js';
import { deleteDummyDocument, DocumentsControllerTestSeeder, dummyDocument } from './seed.js';
import * as fs from 'fs/promises';
import {ResourcesRegistryImpl} from '@triptyk/nfw-resources';

let documentsController: DocumentsController;

beforeAll(async () => {
  await setupIntegrationTest(DocumentsControllerTestSeeder);
  documentsController = container.resolve(DocumentsController);
})

function createAdminUser () {
  const adminUser = new UserModel();
  adminUser.role = Roles.ADMIN;
  return adminUser;
}

testCtx('GetOne', () => container.resolve(MikroORM), async () => {
  const user = await documentsController.get('document', {}, new UserModel());

  expect(user).toStrictEqual({
    jsonapi: { version: '1.0' },
    meta: undefined,
    links: { self: `/api/v1/document/${dummyDocument.id}` },
    data: {
      type: 'document',
      id: 'document',
      attributes: dummyDocument,
      relationships: undefined,
      meta: undefined,
      links: { self: `/api/v1/document/${dummyDocument.id}` },
    },
    included: undefined,
  });
});

testCtx('GetAll', () => container.resolve(MikroORM), async () => {
  const user = await documentsController.findAll({}, new UserModel());

  expect(user).toStrictEqual({
    jsonapi: { version: '1.0' },
    meta: undefined,
    links: { self: '/api/v1/documents' },
    data: [
      {
        type: 'documents',
        id: dummyDocument.id,
        attributes: dummyDocument,
        relationships: undefined,
        meta: undefined,
        links: { self: `/api/v1/documents/${dummyDocument.id}` },
      },
      {
        attributes: deleteDummyDocument,
        id: deleteDummyDocument.id,
        links: {
          self: `/api/v1/documents/${deleteDummyDocument.id}`,
        },
        meta: undefined,
        relationships: undefined,
        type: 'documents',
      },
    ],
    included: undefined,
  });
});

testCtx('CreateOne', () => container.resolve(MikroORM), async () => {
  const document = {
    filename: 'create-file.bmp',
    originalName: 'create-original-name.bmp',
    mimetype: MimeTypes.BMP,
    size: 1337,
    path: 'create-file.bmp',
  };

  const constrollerResponse = await documentsController.create(document, createAdminUser());

  expect(constrollerResponse).toMatchObject({
    jsonapi: { version: '1.0' },
    meta: undefined,
    data: {
      type: 'documents',
      attributes: document,
      relationships: undefined,
      meta: undefined,
    },
    included: undefined,
  });
});

testCtx('Update', () => container.resolve(MikroORM), async () => {
  const updatedDummyDocument = {
    ...dummyDocument,
    filename: 'update-filename',
  };
  const user = await documentsController.update('document', updatedDummyDocument, createAdminUser());

  expect(user).toMatchObject({
    jsonapi: { version: '1.0' },
    meta: undefined,
    data: {
      type: 'users',
      attributes: updatedDummyDocument,
      relationships: undefined,
      meta: undefined,
    },
    included: undefined,
  });
});

testCtx('Delete', () => container.resolve(MikroORM), async () => {
  await generateFile(deleteDummyDocument).catch(console.log);
  const user = await documentsController.delete('delete-document', createAdminUser());
  expect(user).toStrictEqual(null);
  //expect(fs.access(deleteDummyDocument.path)).rejects.toThrowError();
});
