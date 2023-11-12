import { afterAll, beforeAll, expect, test } from 'vitest';
import { accessTokenAdmin } from '../../../utils/access-token.js';
import { fetchApi } from '../../../utils/config.js';
import type { Application } from '../../../../src/application.js';
import { setupAcceptance, teardownAcceptance } from '../../../utils/setup-acceptance-test.js';

let application: Application;

beforeAll(async () => {
  application = await setupAcceptance();
})

afterAll(async () => {
  await teardownAcceptance(application);
})

test('GET / returns status code 200', async () => {
  const users = await fetchApi('users', {
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(users.status).toStrictEqual(200);
});

test('GET id returns status code 200', async () => {
  const users = await fetchApi('users/12345678910abcdef', {
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(users.status).toStrictEqual(200);
});

test('POST returns status code 200', async () => {
  const users = await fetchApi('users', {
    body: JSON.stringify({
      data: {
        attributes: {
          firstName: 'createdFirstName',
          lastName: 'createdLastName',
          email: 'createdEmail',
        },
      }
    }),
    method: 'POST',
    headers: {
      'Content-type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
      Authorization: accessTokenAdmin,
    },
  });

  expect(users.status).toStrictEqual(200);
});

test('PATCH id returns status code 200', async () => {
  const users = await fetchApi('users/12345678910abcdef', {
    body: JSON.stringify({
      data: {
        attributes: {
          firstName: 'updatedFirstName',
        },
      }
    }),
    method: 'PATCH',
    headers: {
      'Content-type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
      Authorization: accessTokenAdmin,
    },
  });

  expect(users.status).toStrictEqual(200);
});

test('DELETE returns status code 204', async () => {
  const users = await fetchApi('users/9876543210', {
    method: 'DELETE',
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(users.status).toStrictEqual(204);
});
