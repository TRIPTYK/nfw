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
    data: [
      {
        type: 'users',
        id: '12345678910abcdef',
        attributes: { firstName: 'amaury' }
      },
      {
        type: 'users',
        id: '4d2834b8-7f22-4a4b-a35b-a2563d1474ce',
        attributes: { firstName: '' }
      },
      {
        type: 'users',
        id: '9876543210',
        attributes: { firstName: 'sebastien' }
      }
    ]
  });
});
