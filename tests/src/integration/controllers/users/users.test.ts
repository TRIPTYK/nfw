import { MikroORM } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import { beforeAll, expect } from 'vitest';
import { UsersController } from '../../../../../src/api/controllers/users.controller.js';
import { Roles } from '../../../../../src/api/enums/roles.enum.js';
import { UserModel } from '../../../../../src/database/models/user.model.js';
import { testCtx } from '../../../../utils/it-request-context.js';
import { setupIntegrationTest } from '../../../../utils/setup-integration-test.js';
import { UsersControllerTestSeeder } from './seed.js';

let usersController: UsersController;

beforeAll(async () => {
  await setupIntegrationTest(UsersControllerTestSeeder);
  usersController = container.resolve(UsersController);
})

function createAdminUser () {
  const adminUser = new UserModel();
  adminUser.role = Roles.ADMIN;
  return adminUser;
}

testCtx('GetOne', () => container.resolve(MikroORM), async () => {
  const user = await usersController.get('admin-user', {}, new UserModel());

  expect(user).toMatchSnapshot();
});

testCtx('GetAll', () => container.resolve(MikroORM), async () => {
  const user = await usersController.findAll({}, new UserModel());

  expect(user).toMatchSnapshot();
});

testCtx('CreateOne', () => container.resolve(MikroORM), async () => {
  const user = await usersController.create({
    firstName: 'amaury',
    lastName: 'deflorenne',
    role: Roles.USER,
    password: '123',
    email: 'amaury@localhost.com'
  }, createAdminUser());

  expect(user).toMatchObject({
    jsonapi: { version: '1.0' },
    meta: undefined,
    data: {
      type: 'users',
      attributes: { firstName: 'amaury' },
      relationships: undefined,
      meta: undefined
    },
    included: undefined
  });
});

testCtx('Update', () => container.resolve(MikroORM), async () => {
  const user = await usersController.update({
    role: Roles.USER
  }, 'user-user', createAdminUser());

  expect(user).toMatchSnapshot();
});

testCtx('Delete', () => container.resolve(MikroORM), async () => {
  const user = await usersController.delete('delete-user', createAdminUser());

  expect(user).toStrictEqual(null);
});
