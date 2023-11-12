import { MikroORM } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import { afterAll, beforeAll, expect } from 'vitest';
import { UsersController } from '../../../../../src/features/users/controllers/users.controller.js';
import { Roles } from '../../../../../src/features/users/enums/roles.enum.js';
import { UserModel } from '../../../../../src/features/users/models/user.model.js';
import { testCtx } from '../../../../utils/it-request-context.js';
import { setupIntegrationTest } from '../../../../utils/setup-integration-test.js';
import { UsersControllerTestSeeder } from './seed.js';
import type { Application } from '../../../../../src/application.js';

let usersController: UsersController;
let application: Application;

beforeAll(async () => {
  application = await setupIntegrationTest(UsersControllerTestSeeder);
  usersController = container.resolve(UsersController);
})

afterAll(async () => {
  await application.stop();
});

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
    email: 'amaury@localhost.com'
  }, createAdminUser(), {});

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
  }, 'user-user', createAdminUser(), {});

  expect(user).toMatchSnapshot();
});

testCtx('Delete', () => container.resolve(MikroORM), async () => {
  const user = await usersController.delete('delete-user', createAdminUser());

  expect(user).toStrictEqual(null);
});
