import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import { afterAll, beforeAll, expect } from 'vitest';

import { MikroORM } from '@mikro-orm/core';
import { AuthControllerTestSeeder } from './seed.js';
import { setupIntegrationTest } from '../../../../utils/setup-integration-test.js';
import { testCtx } from '../../../../utils/it-request-context.js';
import { AuthController } from '../../../../../src/features/auth/controllers/auth.controller.js';
import { DatabaseConnectionImpl } from '../../../../../src/database/connection.js';
import { RefreshTokenModel } from '../../../../../src/features/auth/models/refresh-token.model.js';
import type { Application } from '../../../../../src/application.js';

let application: Application;

beforeAll(async () => {
  application = await setupIntegrationTest(AuthControllerTestSeeder);
})

afterAll(async () => {
  await application.stop();
});

testCtx('Login creates a refresh token', () => container.resolve(MikroORM), async () => {
  const authController = container.resolve(AuthController);

  const response = await authController.login({
    email: 'amaury@localhost.com',
    password: '123'
  });

  const refreshTokenRepository = container.resolve(DatabaseConnectionImpl).connection.em.getRepository(RefreshTokenModel);
  const refresh = await refreshTokenRepository.findOne({ user: '12345678910abcdef' });

  expect(refresh).not.toBeNull();
  expect(response).toBeTypeOf('object');
});
