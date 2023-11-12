import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import { beforeAll, expect } from 'vitest';

import { MikroORM } from '@mikro-orm/core';
import { AuthControllerTestSeeder } from './seed.js';
import { setupIntegrationTest } from '../../../../utils/setup-integration-test.js';
import { testCtx } from '../../../../utils/it-request-context.js';
import { AuthController } from '../../../../../src/features/auth/controllers/auth.controller.js';
import { DatabaseConnectionImpl } from '../../../../../src/database/connection.js';
import { RefreshTokenModel } from '../../../../../src/features/auth/models/refresh-token.model.js';

beforeAll(async () => {
  await setupIntegrationTest(AuthControllerTestSeeder);
})

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
