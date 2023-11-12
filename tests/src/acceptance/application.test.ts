import fetch from 'node-fetch';
import { test, expect, beforeAll, afterAll } from 'vitest';
import { setupAcceptance, teardownAcceptance } from '../../utils/setup-acceptance-test.js';
import type { Application } from '../../../src/application.js';

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
