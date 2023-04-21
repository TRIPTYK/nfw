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
      Authorization: accessTokenAdmin,
    },
  });

  expect(users.status).toStrictEqual(200);
});

test('PATCH returns list of users', async () => {
  const users = await fetchApi('users', {
    body: {
      firstName: 'updatedFirstName',
    },
    method: 'PATCH',
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  expect(users.status).toStrictEqual(200);
});
