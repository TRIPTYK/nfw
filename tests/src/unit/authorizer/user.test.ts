import 'reflect-metadata';
import { expect, test } from 'vitest';
import { Roles } from '../../../../src/features/users/enums/roles.enum.js';
import { UserModel } from '../../../../src/features/users/models/user.model.js';
import { UserResourceAuthorizerImpl } from '../../../../src/features/users/resources/user/authorizer.js';

const adminUser = new UserModel();
adminUser.role = Roles.ADMIN;
adminUser.id = '1';

const normalUser = new UserModel();
normalUser.role = Roles.USER;
normalUser.id = '2';

const authorizer = new UserResourceAuthorizerImpl();

test('Admin can read other admins', () => {
  const user = new UserResourceAuthorizerImpl();
  expect(user.can(adminUser, 'read', normalUser)).toBe(true);
});

test('Admin can read other admins', () => {
  expect(authorizer.can(adminUser, 'read', normalUser)).toBe(true);
});

test('Admin can edit other admins', () => {
  const otherAdmin = new UserModel();
  otherAdmin.role = Roles.ADMIN;
  otherAdmin.id = '3';

  expect(authorizer.can(adminUser, 'update', otherAdmin)).toBe(true);
});

test('Admin can edit any user', () => {
  expect(authorizer.can(adminUser, 'update', normalUser)).toBe(true);
});

test('User can edit itself', () => {
  expect(authorizer.can(adminUser, 'update', adminUser)).toBe(true);
});

test('Admin can delete any user', () => {
  expect(authorizer.can(adminUser, 'delete', normalUser)).toBe(true);
});

test('Admin cannot delete itself', () => {
  expect(authorizer.can(adminUser, 'delete', adminUser)).toBe(false);
});
