import { DatabaseSeeder } from 'app/database/seeders/test/test.seeder.js';
import { deleteDummyDocument, dummyDocument } from 'tests/src/integration/controllers/documents/seed.js';
import { createFile } from 'tests/utils/create-file-with-relation.js';
import { generateFile } from 'tests/utils/generate-file.js';
import { setupIntegrationTest } from 'tests/utils/setup-integration-test.js';
import { beforeAll, expect, test } from 'vitest';
import { accessTokenAdmin } from '../../../utils/access-token.js';
import { fetchApi } from '../../../utils/config.js';

beforeAll(async () => {
  await setupIntegrationTest(DatabaseSeeder);
})

test('GET / returns list of documents', async () => {
  const response = await fetchApi('documents', {
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(response.status).toStrictEqual(200);
});

test('GET id returns document', async () => {
  const response = await fetchApi('documents/document', {
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(response.status).toStrictEqual(200);
});

test('POST document returns document', async () => {
  const response = await fetchApi('documents', {
    method: 'POST',
    body: createFile(),
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(response.status).toStrictEqual(200);
});

test('PATCH document returns document', async () => {
  const formData = createFile();
  formData.append('id', dummyDocument.id);
  const response = await fetchApi('documents', {
    method: 'PATCH',
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(response.status).toStrictEqual(200);
});

test('DELETE document returns document', async () => {
  await generateFile(deleteDummyDocument);
  const response = await fetchApi('documents/delete-document', {
    method: 'DELETE',
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(response.status).toStrictEqual(204);
});
