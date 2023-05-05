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

test('GET / returns status 200', async () => {
  const response = await fetchApi('documents', {
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(response.status).toStrictEqual(200);
});

test('GET id returns status 200', async () => {
  const response = await fetchApi('documents/document', {
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(response.status).toStrictEqual(200);
});

test('POST document returns status 200', async () => {
  const response = await fetchApi('documents', {
    method: 'POST',
    body: createFile(),
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(response.status).toStrictEqual(200);
});

test('PUT document return status 200', async () => {
  const formData = createFile();
  formData.append('id', dummyDocument.id);
  const response = await fetchApi('documents', {
    method: 'PUT',
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(response.status).toStrictEqual(200);
});

test('DELETE document returns status 204', async () => {
  await generateFile(deleteDummyDocument);
  const response = await fetchApi('documents/delete-document', {
    method: 'DELETE',
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(response.status).toStrictEqual(204);
});
