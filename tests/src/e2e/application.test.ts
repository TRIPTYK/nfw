import fetch from 'node-fetch';
import { test, expect } from 'vitest';

test('Application should listen to requests', async () => {
  const response = await fetch('http://localhost:8001');
  expect(response.status).toStrictEqual(404);
});

test('Application should invoke not-found handler', async () => {
  const response = await fetch('http://localhost:8001/api/v1');
  expect(response.status).toStrictEqual(404);
});
