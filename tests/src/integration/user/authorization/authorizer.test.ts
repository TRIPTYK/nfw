import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import { JsonApiRegistryImpl } from '@triptyk/nfw-resources';
import { assert, beforeEach, test } from 'vitest';
import type { UserResourceAuthorizer } from '../../../../../src/api/resources/user/authorizer.js';
import type { UserModel } from '../../../../../src/database/models/user.model.js';
import { setup } from '../../setup.js';
import { Roles } from '../../../../../src/api/enums/roles.enum.js';
import type { UserResource } from '../../../../../src/api/resources/user/resource.js';
import type { ResourceFactory } from 'resources';
import type { UserResourceFactory } from '../../../../../src/api/resources/user/factory.js';

let authorizer: UserResourceAuthorizer;

const admin = {
  id: '1',
  firstName: '',
  lastName: '',
  role: Roles.ADMIN
} as UserModel;

const user = {
  id: '2',
  firstName: '',
  lastName: '',
  role: Roles.USER
} as UserModel;

let factory: ResourceFactory<UserResource>;

beforeEach(async () => {
  await setup();
  const registry = container.resolve(JsonApiRegistryImpl);
  factory = registry.getFactoryFor('users') as UserResourceFactory;
  authorizer = registry.getAuthorizerFor('users') as UserResourceAuthorizer;
})

test('Admin should be able to read any users other than admin', async () => {
  const target = await factory.create({
    role: Roles.ADMIN
  });

  assert.isTrue(
    await authorizer.can(admin, 'read', target)
  );
});

test('A regular user should only be able to read itself', async () => {
  const target = await factory.create({
    id: user.id,
    role: Roles.ADMIN
  });
  assert.isTrue(
    await authorizer.can(user, 'read', target)
  );
});

test('A regular user should only be able to update itself', async () => {
  const target = await factory.create({
    id: user.id,
    role: Roles.USER
  });
  assert.isTrue(
    await authorizer.can(user, 'update', target)
  );
});

test('A regular user should only be able to edit his name', async () => {
  const target = await factory.create({
    id: user.id,
    firstName: 'newFirstName',
    lastName: 'newLastName',
    role: Roles.USER
  });
  assert.isTrue(
    await authorizer.can(user, 'update', target)
  );
});

test('A regular user should not be able to edit his password', async () => {
  const target = await factory.create({
    id: user.id,
    password: '123',
    role: Roles.USER
  });
  assert.isFalse(
    await authorizer.can(user, 'update', target)
  );
});
