import { MikroORM } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import { afterAll, beforeAll, expect, vi } from 'vitest';
import { testCtx } from '../../../../utils/it-request-context.js';
import { setupIntegrationTest } from '../../../../utils/setup-integration-test.js';
import { unlink } from 'fs/promises';
import { DocumentsControllerTestSeeder, dummyDocument, deleteDummyDocument } from '../../../../../src/database/seeders/test/seed.js';
import { DocumentsController } from '../../../../../src/features/users/controllers/documents.controller.js';
import { MimeTypes } from '../../../../../src/features/users/enums/mime-type.enum.js';
import { Roles } from '../../../../../src/features/users/enums/roles.enum.js';
import { UserModel } from '../../../../../src/features/users/models/user.model.js';
import type { Application } from '../../../../../src/application.js';

let application: Application;
let documentsController: DocumentsController;

beforeAll(async () => {
  application = await setupIntegrationTest(DocumentsControllerTestSeeder);
  documentsController = container.resolve(DocumentsController);
})

afterAll(async () => {
  await application.stop();
});

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
    users: []
  };

  const constrollerResponse = await documentsController.create(document, {}, createAdminUser());

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
    users: [],
    filename: 'update-filename',
  };
  const user = await documentsController.update('document', updatedDummyDocument, {}, createAdminUser());

  expect(user).toMatchSnapshot();
});

vi.mock('fs/promises', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actualImport = await vi.importActual<typeof import('fs/promises')>('fs/promises');
  return {
    ...actualImport,
    unlink: vi.fn()
  }
})

testCtx('Delete', () => container.resolve(MikroORM), async () => {
  const user = await documentsController.delete('delete-document', createAdminUser());
  expect(unlink).toBeCalledWith(deleteDummyDocument.path);
  expect(user).toStrictEqual(null);
});

afterAll(() => {
  vi.restoreAllMocks();
})
