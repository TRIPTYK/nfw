import { expect, test } from 'vitest';
import { accessTokenAdmin } from '../../../utils/access-token.js';
import { fetchApi } from '../../../utils/config.js';

test('GET / returns list of users', async () => {
  const users = await fetchApi('users', {
    headers: {
      Authorization: accessTokenAdmin
    }
  });

  const json = await users.json();

  expect(users.status).toStrictEqual(200);
  expect(json).toStrictEqual({
    jsonapi: { version: '1.0' },
    links: { self: '/api/v1/users' },
    data: [
      {
        type: 'users',
        id: '12345678910abcdef',
        attributes: { firstName: 'amaury' },
        links: { self: '/api/v1/users/12345678910abcdef' }
      },
      {
        type: 'users',
        id: '7130f0c0-4b5a-4c55-bb41-56472d41f159',
        attributes: { firstName: '' },
        links: { self: '/api/v1/users/7130f0c0-4b5a-4c55-bb41-56472d41f159' }
      },
      {
        type: 'users',
        id: '9876543210',
        attributes: { firstName: 'sebastien' },
        links: { self: '/api/v1/users/9876543210' }
      },
      {
        type: 'users',
        id: 'dfaf7491-1da5-487e-a60a-5119bf2b66dc',
        attributes: { firstName: 'amaury' },
        links: { self: '/api/v1/users/dfaf7491-1da5-487e-a60a-5119bf2b66dc' }
      }
    ]
  });
});
