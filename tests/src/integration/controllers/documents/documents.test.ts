import { MikroORM } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import { beforeAll, expect } from 'vitest';
import { DocumentsController } from 'app/api/controllers/documents.controller.js';
import { MimeTypes } from 'app/api/enums/mime-type.enum.js';
import { Roles } from 'app/api/enums/roles.enum.js';
import { UserModel } from 'app/database/models/user.model.js';
import { generateFile } from '../../../../utils/generate-file.js';
import { testCtx } from '../../../../utils/it-request-context.js';
import { setupIntegrationTest } from '../../../../utils/setup-integration-test.js';
import { deleteDummyDocument, DocumentsControllerTestSeeder, dummyDocument } from './seed.js';

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
  const document = await documentsController.get('document', {}, new UserModel());

  expect(document).toMatchSnapshot();
});

testCtx('GetAll', () => container.resolve(MikroORM), async () => {
  const document = await documentsController.findAll({}, new UserModel());

  expect(document).toMatchSnapshot();
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
    data: {
      attributes: {
        filename: 'create-file.bmp',
        mimetype: 'image/bmp',
        originalName: 'create-original-name.bmp',
        path: 'create-file.bmp',
        size: 1337,
      },
      relationships: undefined,
      type: 'documents',
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

  expect(user).toMatchSnapshot();
});

testCtx('Delete', () => container.resolve(MikroORM), async () => {
  await generateFile(deleteDummyDocument);
  const user = await documentsController.delete('delete-document', createAdminUser());
  expect(user).toStrictEqual(null);
});
