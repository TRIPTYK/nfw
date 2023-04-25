import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import { beforeAll, expect } from 'vitest';
import { AuthController } from '../../../../../src/api/controllers/auth.controller.js';
import { MikroORM } from '@mikro-orm/core';
import { testCtx } from '../../../../utils/it-request-context.js';
import { DatabaseConnectionImpl } from '../../../../../src/database/connection.js';
import { RefreshTokenModel } from '../../../../../src/database/models/refresh-token.model.js';
import { AuthControllerTestSeeder } from './seed.js';
import { setupIntegrationTest } from '../../../../utils/setup-integration-test.js';

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
