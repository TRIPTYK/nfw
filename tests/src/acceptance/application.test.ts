import type { Application } from 'app/application.js';
import fetch from 'node-fetch';
import { teardownAcceptance, setupAcceptance } from 'tests/utils/setup-acceptance-test.js';
import { test, expect, beforeAll, afterAll } from 'vitest';

let application: Application;

beforeAll(async () => {
  application = await setupAcceptance();
})

afterAll(async () => {
  await teardownAcceptance(application);
})

test('Application should listen to requests', async () => {
  const response = await fetch('http://localhost:8001');
  expect(response.status).toStrictEqual(404);
});

test('Application should invoke not-found handler', async () => {
  const response = await fetch('http://localhost:8001/api/v1');
  expect(response.status).toStrictEqual(404);
});
