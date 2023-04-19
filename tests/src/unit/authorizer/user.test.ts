import 'reflect-metadata';
import { expect, test } from 'vitest';
import { Roles } from '../../../../src/api/enums/roles.enum.js';
import { UserResourceAuthorizerImpl } from '../../../../src/api/resources/user/authorizer.js';
import { UserModel } from '../../../../src/database/models/user.model.js';

const adminUser = new UserModel();
adminUser.role = Roles.ADMIN;
adminUser.id = '1';

const normalUser = new UserModel();
normalUser.role = Roles.ADMIN;
normalUser.id = '2';

const authorizer = new UserResourceAuthorizerImpl();

test('Admin can read other admins', () => {
  const user = new UserResourceAuthorizerImpl();
  expect(user.can(adminUser, 'read', normalUser, {})).toBe(true);
});

test('Admin can read other admins', () => {
  expect(authorizer.can(adminUser, 'read', normalUser, {})).toBe(true);
});

test('Admin cannot edit other admins', () => {
  const otherAdmin = new UserModel();
  otherAdmin.role = Roles.ADMIN;
  otherAdmin.id = '3';

  expect(authorizer.can(adminUser, 'update', otherAdmin, {})).toBe(false);
});

test('User can edit itself', () => {
  expect(authorizer.can(adminUser, 'update', adminUser, {})).toBe(true);
});

test('Admin cannot delete itself', () => {
  expect(authorizer.can(adminUser, 'delete', adminUser, {})).toBe(false);
});
