/* eslint-disable no-undef */
import fetch from 'node-fetch';

/* eslint-disable no-undef */
test('Login', async () => {
  const response = await fetch('http://localhost:8001/api/v1/auth/login', {
    body: JSON.stringify({
      email: 'amaury@localhost.com',
      password: '123',
    }),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  });
  expect(response.status).toStrictEqual(200);

  const body = await response.json() as Record<string, string>;
  expect(body).toHaveProperty('accessToken');
  expect(body).toHaveProperty('refreshToken');
});

test('Login incorrect user/password', async () => {
  const response = await fetch('http://localhost:8001/api/v1/auth/login', {
    body: JSON.stringify({
      email: 'amaury@localhost.com',
      password: '1234',
    }),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  });
  expect(response.status).toStrictEqual(417);
  const body = await response.json() as Record<string, string>;
  expect(body).not.toHaveProperty('accessToken');
  expect(body).not.toHaveProperty('refreshToken');
});

test('Auth register', async () => {
  const response = await fetch('http://localhost:8001/api/v1/auth/register', {
    body: JSON.stringify({
      password: '123',
      email: 'amauryD@gmail.com',
      firstName: 'amaury',
      lastName: 'localhost',
    }),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  });
  expect(response.status).toStrictEqual(201);
  const body = await response.json() as Record<string, string>;
  expect(typeof body.id).toStrictEqual('string');
  delete body.id;
  expect(body).toMatchObject({
    email: 'amauryD@gmail.com',
    firstName: 'amaury',
    lastName: 'localhost',
  });
});

test('Auth register must deny unknown property', async () => {
  const response = await fetch('http://localhost:8001/api/v1/auth/register', {
    body: JSON.stringify({
      password: '123',
      email: 'amauryD@gmail.com',
      firstName: 'amaury',
      lastName: 'localhost',
      role: 'admin',
    }),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  });
  expect(response.status).toStrictEqual(400);
});

test('Refreshing token', async () => {
  const response = await fetch('http://localhost:8001/api/v1/auth/login', {
    body: JSON.stringify({
      email: 'amaury@localhost.com',
      password: '123',
    }),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  });

  expect(response.status).toStrictEqual(200);

  const body = await response.json() as Record<string, string>;

  expect(body).toHaveProperty('accessToken');
  expect(body).toHaveProperty('refreshToken');

  // Wait 1s otherwise the accesstoken would be the same because of UNIX timestamp
  await new Promise((resolve, _reject) => setTimeout(resolve, 1000));

  const refreshResponse = await fetch('http://localhost:8001/api/v1/auth/refresh-token', {
    body: JSON.stringify({
      refreshToken: body.refreshToken,
    }),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  });

  expect(refreshResponse.status).toStrictEqual(200);

  const refreshBody = await refreshResponse.json() as Record<string, string>;

  expect(typeof refreshBody.accessToken).toStrictEqual('string');
  expect(refreshBody.accessToken).not.toStrictEqual(body.accessToken);
});

test('Refreshing wrong token', async () => {
  const refreshResponse = await fetch('http://localhost:8001/api/v1/auth/refresh-token', {
    body: JSON.stringify({
      refreshToken: 'sdkl,dkjkjfl',
    }),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  });

  expect(refreshResponse.status).toStrictEqual(417);

  const refreshBody = await refreshResponse.json() as Record<string, string>;

  expect(refreshBody).not.toHaveProperty('accessToken');
});
