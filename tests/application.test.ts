/* eslint-disable no-undef */
import fetch from 'node-fetch';

/* eslint-disable no-undef */
test('Application should listen to requests', async () => {
  const response = await fetch('http://localhost:8001');
  expect(response.status).toStrictEqual(404);
});

test('Application should invoke not-found handler', async () => {
  const response = await fetch('http://localhost:8001/api/v1');
  expect(response.status).toStrictEqual(404);
  const body = await response.json();
  expect(body).toMatchObject({
    message: 'Not found',
    code: 404,
  });
});
