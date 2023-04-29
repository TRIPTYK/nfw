import { DatabaseSeeder } from 'app/database/seeders/development/development.seeder.js';
import { setupIntegrationTest } from 'tests/utils/setup-integration-test.js';
import { beforeAll, expect, test } from 'vitest';
import { accessTokenAdmin } from '../../../utils/access-token.js';
import { fetchApi } from '../../../utils/config.js';

beforeAll(async () => {
  await setupIntegrationTest(DatabaseSeeder);
})

test('GET / returns list of users', async () => {
  const users = await fetchApi('users', {
    headers: {
      Authorization: accessTokenAdmin
    }
  });

  const json = await users.json();

  expect(users.status).toStrictEqual(200);
  expect(json).toMatchObject({
    data: [
      {
        attributes: {
          firstName: 'amaury'
        },
        id: '12345678910abcdef',
        links: {
          self: '/api/v1/users/12345678910abcdef'
        },
        type: 'users'
      },
      {
        attributes: {
          firstName: 'sebastien'
        },
        id: '9876543210',
        links: {
          self: '/api/v1/users/9876543210'
        },
        type: 'users'
      }
    ],
    jsonapi: {
      version: '1.0'
    },
    links: {
      self: '/api/v1/users'
    }
  });
});
