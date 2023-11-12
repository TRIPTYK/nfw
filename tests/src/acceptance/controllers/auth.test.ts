import { test, expect, beforeAll, afterAll } from 'vitest';
import { fetchApi } from '../../../utils/config.js';
import type { Application } from '../../../../src/application.js';
import { setupAcceptance, teardownAcceptance } from '../../../utils/setup-acceptance-test.js';

const resource = 'auth';

let application: Application;

beforeAll(async () => {
  application = await setupAcceptance();
})

afterAll(async () => {
  await teardownAcceptance(application);
})

test('Login', async () => {
  const response = await fetchApi(`${resource}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'amaury@localhost.com', password: '123' })
  });

  const body = await response.json();

  expect(response.status).toStrictEqual(200);
  expect(body).toHaveProperty('accessToken');
  expect(body).toHaveProperty('refreshToken');
});

test('Login with incorrect user/password', async () => {
  const response = await fetchApi(`${resource}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'amaury@localhost.com', password: '1234' })
  });

  expect(response.status).toStrictEqual(417);

  const body = await response.json();
  expect(body).not.toHaveProperty('accessToken');
  expect(body).not.toHaveProperty('refreshToken');
});

test('Register', async () => {
  const user = {
    email: 'amauryD@gmail.com',
    password: '123',
    firstName: 'amaury',
    lastName: 'localhost'
  };

  const response = await fetchApi(`${resource}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });

  expect(response.status).toStrictEqual(201);

  const body = await response.json() as Record<string, unknown>;
  expect(typeof body.id).toStrictEqual('string');
  // @ts-expect-error
  delete user.password;
  expect(body).toMatchObject(user);
});

test('Register should deny unknown property', async () => {
  const response = await fetchApi(`${resource}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'amauryD@gmail.com',
      password: '123',
      firstName: 'amaury',
      lastName: 'localhost',
      role: 'admin'
    })
  });

  expect(response.status).toStrictEqual(400);
});

test('Refresh token', async () => {
  const loginResponse = await fetchApi(`${resource}/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: '123' })
  });

  expect(loginResponse.status).toStrictEqual(200);

  const loginBody = await loginResponse.json() as Record<string, unknown>;
  expect(loginBody).toHaveProperty('accessToken');
  expect(loginBody).toHaveProperty('refreshToken');

  // Wait 1 second to ensure that the access token has expired
  await new Promise(resolve => setTimeout(resolve, 1000));

  const refreshResponse = await fetchApi(`${resource}/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: loginBody.refreshToken })
  });

  expect(refreshResponse.status).toStrictEqual(200);

  const refreshBody = await refreshResponse.json() as Record<string, unknown>;
  expect(typeof refreshBody.accessToken).toStrictEqual('string');
  expect(refreshBody.accessToken).not.toStrictEqual(loginBody.accessToken);
});

test('Refreshing wrong token', async () => {
  const refreshResponse = await fetchApi(`${resource}/refresh-token`, {
    body: JSON.stringify({
      refreshToken: 'sdkl,dkjkjfl'
    }),
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST'
  });

  expect(refreshResponse.status).toStrictEqual(417);

  const refreshBody = await refreshResponse.json() as Record<string, string>;

  expect(refreshBody).not.toHaveProperty('accessToken');
});
