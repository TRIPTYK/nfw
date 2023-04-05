import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import { assert, beforeEach, describe, test } from 'vitest';
import type { UserModel } from '../../../../src/database/models/user.model.js';
import { UserResourceAuthorizer } from '../../../../src/api/resources/user/authorizer.js';
import { Roles } from '../../../../src/api/enums/roles.enum.js';
import { UserResource } from '../../../../src/api/resources/user/resource.js';

describe('admin', () => {
  let authorizer: UserResourceAuthorizer;

  const adminUser = {
    role: Roles.ADMIN,
    id: '1'
  } as UserModel;

  function userResource () {
    const otherUser = new UserResource();
    otherUser.role = Roles.USER;
    return otherUser;
  }

  function adminResource (id?: string) {
    const otherAdmin = new UserResource();
    otherAdmin.role = Roles.ADMIN;
    otherAdmin.id = id;
    return otherAdmin;
  }

  beforeEach(() => {
    authorizer = container.resolve(UserResourceAuthorizer);
  })

  test('can create simple users', () => {
    assert.strictEqual(authorizer.can(adminUser, 'create', userResource()), true);
  });

  test('cannot create other admin', () => {
    assert.strictEqual(authorizer.can(adminUser, 'create', adminResource()), false);
  });

  test('can read normal users', () => {
    assert.strictEqual(authorizer.can(adminUser, 'read', userResource()), true);
  });

  test('can read admins', () => {
    assert.strictEqual(authorizer.can(adminUser, 'read', adminResource()), true);
  });

  test('can update self', () => {
    assert.strictEqual(authorizer.can(adminUser, 'update', adminResource(adminUser.id)), true);
  });

  test('can update a regular user', () => {
    assert.strictEqual(authorizer.can(adminUser, 'update', userResource()), true);
  });

  test('cannot update other admins', () => {
    assert.strictEqual(authorizer.can(adminUser, 'update', adminResource()), false);
  });

  test('cannot delete other admins', () => {
    assert.strictEqual(authorizer.can(adminUser, 'delete', adminResource()), false);
  });
});
