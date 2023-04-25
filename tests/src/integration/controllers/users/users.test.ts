import { MikroORM } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import { beforeAll, expect } from 'vitest';
import { UsersController } from '../../../../../src/api/controllers/users.controller.js';
import { UserModel } from '../../../../../src/database/models/user.model.js';
import { testCtx } from '../../../../utils/it-request-context.js';
import { setupIntegrationTest } from '../../../../utils/setup-integration-test.js';
import { UsersControllerTestSeeder } from './seed.js';

beforeAll(async () => {
  await setupIntegrationTest(UsersControllerTestSeeder);
})

testCtx('GetOne', () => container.resolve(MikroORM), async () => {
  const usersController = container.resolve(UsersController);
  const user = await usersController.get('12345678910abcdef', {}, new UserModel());

  expect(user).toStrictEqual({
    jsonapi: { version: '1.0' },
    meta: undefined,
    links: { self: '/api/v1/users/12345678910abcdef' },
    data: {
      type: 'users',
      id: '12345678910abcdef',
      attributes: { firstName: 'amaury' },
      relationships: undefined,
      meta: undefined,
      links: { self: '/api/v1/users/12345678910abcdef' }
    },
    included: undefined
  });
});

testCtx('GetAll', () => container.resolve(MikroORM), async () => {
  const usersController = container.resolve(UsersController);
  const user = await usersController.findAll({}, new UserModel());

  expect(user).toStrictEqual({
    jsonapi: { version: '1.0' },
    meta: undefined,
    links: { self: '/api/v1/users' },
    data: [
      {
        type: 'users',
        id: '12345678910abcdef',
        attributes: { firstName: 'amaury' },
        relationships: undefined,
        meta: undefined,
        links: { self: '/api/v1/users/12345678910abcdef' }
      }
    ],
    included: undefined
  });
});
