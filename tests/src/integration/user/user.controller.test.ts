import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import { expect, test, beforeEach } from 'vitest';
import { UsersController } from '../../../../src/api/controllers/user.controller.js';
import { UserModel } from '../../../../src/database/models/user.model.js';
import { Application } from '../../../../src/application.js';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { Roles } from '../../../../src/api/enums/roles.enum.js';

let controller: UsersController;
let currentUser: UserModel;

beforeEach(async () => {
  const application = new Application();
  await application.setup();
  controller = container.resolve(UsersController);

  currentUser = new UserModel();
  currentUser.role = Roles.ADMIN;
})

const body = {
  email: 'admin3@localhost.com',
  firstName: 'Adriel',
  password: '123',
  role: 'user',
  lastName: 'Wuckert'
};

test('It gets a user', async () => {
  const getClientId = '9876543210';

  await RequestContext.createAsync(container.resolve(MikroORM).em.fork(), async () => {
    const controllerResult = await controller.get(getClientId, currentUser);

    expect(controllerResult).toMatchObject({
      documents: [{
        id: '123456789',
        type: 'document'
      }],
      email: 'seb@localhost.com',
      firstName: 'sebastien',
      lastName: 'dutrèsgrosgrosXXXLDuGras',
      role: 'user',
      id: getClientId
    });
    expect(controllerResult).toHaveProperty('id');
  })
});

test('It creates a user', async () => {
  await RequestContext.createAsync(container.resolve(MikroORM).em.fork(), async () => {
    const controllerResult = await controller.create(body, currentUser);

    expect(controllerResult).toMatchObject({
      documents: [],
      email: 'admin3@localhost.com',
      firstName: 'Adriel',
      lastName: 'Wuckert',
      role: 'user'
    });
    expect(controllerResult).toHaveProperty('id');
  })
});

test('It updates user', async () => {
  const updatedClientId = '12345678910abcdef';

  await RequestContext.createAsync(container.resolve(MikroORM).em.fork(), async () => {
    const controllerResult = await controller.update(body, updatedClientId, currentUser);

    expect(controllerResult).toMatchObject({
      documents: [],
      email: 'admin3@localhost.com',
      firstName: 'Adriel',
      lastName: 'Wuckert',
      role: 'user'
    });
    expect(controllerResult).toHaveProperty('id', updatedClientId);
  })
});

test('It deletes user', async () => {
  const deleteClientId = '9876543210';

  await RequestContext.createAsync(container.resolve(MikroORM).em.fork(), async () => {
    const controllerResult = await controller.delete(deleteClientId, currentUser);
    expect(controllerResult).toBeUndefined();
  })
});
