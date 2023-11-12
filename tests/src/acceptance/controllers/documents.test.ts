import { afterEach, beforeEach, expect, test, vitest } from 'vitest';
import { accessTokenAdmin } from '../../../utils/access-token.js';
import { fetchApi } from '../../../utils/config.js';
import type { Application } from '../../../../src/application.js';
import { setupAcceptance, teardownAcceptance } from '../../../utils/setup-acceptance-test.js';
import { createFileWithManyRelationship } from '../../../utils/create-file-with-relation.js';
import { dummyDocument } from '../../../../src/database/seeders/test/seed.js';

let application: Application;

beforeEach(async () => {
  application = await setupAcceptance();
})

afterEach(async () => {
  await teardownAcceptance(application);
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
    body: createFileWithManyRelationship({
      resourceId: '12345678910abcdef',
      relationName: 'users',
      resourceType: 'users'
    }),
    headers: {
      Accept: 'application/vnd.api+json',
      Authorization: accessTokenAdmin,
    },
  });

  expect(response.status).toStrictEqual(200);
});

test('PUT document return status 200', async () => {
  const formData = createFileWithManyRelationship({
    resourceId: '12345678910abcdef',
    relationName: 'users',
    resourceType: 'users'
  });
  formData.append('id', dummyDocument.id);

  const response = await fetchApi('documents/document', {
    method: 'PUT',
    body: formData,
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(response.status).toStrictEqual(200);
});

vitest.mock('fs/promises', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actualImport = await vitest.importActual<typeof import('fs/promises')>('fs/promises');
  return {
    ...actualImport,
    unlink: vitest.fn()
  }
})

test('DELETE document returns status 204', async () => {
  const response = await fetchApi('documents/delete-document', {
    method: 'DELETE',
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(response.status).toStrictEqual(204);
});
