import { DatabaseSeeder } from 'app/database/seeders/test/test.seeder.js';
import fetch from 'node-fetch';
import { setupIntegrationTest } from 'tests/utils/setup-integration-test.js';
import { test, expect, beforeAll } from 'vitest';

beforeAll(async () => {
  await setupIntegrationTest(DatabaseSeeder);
})

test('Application should listen to requests', async () => {
  const response = await fetch('http://localhost:8001');
  expect(response.status).toStrictEqual(404);
});

test('Application should invoke not-found handler', async () => {
  const response = await fetch('http://localhost:8001/api/v1');
  expect(response.status).toStrictEqual(404);
});
