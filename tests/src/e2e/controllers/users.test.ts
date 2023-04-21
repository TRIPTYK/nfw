import 'reflect-metadata';
import { expect, test } from 'vitest';
import { accessTokenAdmin } from '../../../utils/access-token.js';
import { fetchApi } from '../../../utils/config.js';

test('GET / returns list of users', async () => {
  const users = await fetchApi('users', {
    headers: {
      Authorization: accessTokenAdmin,
    },
  });

  const json = await users.json();

  expect(users.status).toStrictEqual(200);
  expect(json).toMatchObject({
    jsonapi: { version: '1.0' },
    links: { self: '/api/v1/users' },
    data: [
      {
        type: 'users',
        id: '12345678910abcdef',
        attributes: { firstName: 'amaury' },
        links: { self: '/api/v1/users/12345678910abcdef' },
      },
      {
        type: 'users',
        id: '2d79f122-6a17-4db7-ace2-0d74073b4828',
        attributes: { firstName: '' },
        links: { self: '/api/v1/users/2d79f122-6a17-4db7-ace2-0d74073b4828' },
      },
      {
        type: 'users',
        id: '9876543210',
        attributes: { firstName: 'sebastien' },
        links: { self: '/api/v1/users/9876543210' },
      },
      {
        type: 'users',
        id: 'adfa94fb-c5dd-487e-bbbc-228b9c05d617',
        attributes: { firstName: 'amaury' },
        links: { self: '/api/v1/users/adfa94fb-c5dd-487e-bbbc-228b9c05d617' },
      },
    ],
  });
});
