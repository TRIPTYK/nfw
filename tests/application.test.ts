import fetch from 'node-fetch';
import { runApplication } from '../src/application.js';

/* eslint-disable no-undef */
test('Application should listen to requests', async () => {
  const server = await runApplication();

  const response = await fetch('http://localhost:8001');
  expect(response.status).toStrictEqual(404);
  await new Promise((resolve, _reject) => server.close(resolve));
});
