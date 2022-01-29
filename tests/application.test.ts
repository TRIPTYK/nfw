/* eslint-disable no-undef */
import fetch from 'node-fetch';

/* eslint-disable no-undef */
test('Application should listen to requests', async () => {
  const response = await fetch('http://localhost:8001');
  expect(response.status).toStrictEqual(404);
});
