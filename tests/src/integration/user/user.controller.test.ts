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
  data: {
    attributes: {
      email: 'admin3@localhost.com',
      firstName: 'Adriel',
      password: '123',
      role: 'user',
      lastName: 'Wuckert'
    }
  }
};

test('It gets a user', async () => {
  const getClientId = '9876543210';

  await RequestContext.createAsync(container.resolve(MikroORM).em.fork(), async () => {
    const controllerResult = await controller.get(getClientId, currentUser);

    expect(controllerResult).toStrictEqual({
      jsonapi: { version: '1.0' },
      meta: undefined,
      links: undefined,
      data: {
        type: 'user',
        id: '9876543210',
        attributes: {
          firstName: 'sebastien',
          lastName: 'dutrèsgrosgrosXXXLDuGras',
          role: 'user',
          email: 'seb@localhost.com'
        },
        relationships: {
          documents: {
            links: undefined,
            meta: undefined,
            data: [{ type: 'document', id: '123456789' }]
          }
        },
        meta: undefined,
        links: undefined
      },
      included: [
        {
          type: 'document',
          id: '123456789',
          attributes: { type: 'document' },
          relationships: undefined,
          meta: undefined,
          links: undefined
        }
      ]
    });
  })
});

test('It creates a user', async () => {
  await RequestContext.createAsync(container.resolve(MikroORM).em.fork(), async () => {
    const controllerResult = await controller.create(body, currentUser);

    expect(controllerResult).toMatchObject({
      jsonapi: { version: '1.0' },
      meta: undefined,
      links: undefined,
      data: {
        type: 'user',
        attributes: {
          firstName: 'Adriel',
          lastName: 'Wuckert',
          role: 'user',
          email: 'admin3@localhost.com'
        },
        relationships: { documents: { links: undefined, meta: undefined, data: [] } },
        meta: undefined,
        links: undefined
      },
      included: undefined
    });
  })
});

test('It updates user', async () => {
  const updatedClientId = '12345678910abcdef';

  await RequestContext.createAsync(container.resolve(MikroORM).em.fork(), async () => {
    const controllerResult = await controller.update(body, updatedClientId, currentUser);

    expect(controllerResult).toMatchObject({
      jsonapi: { version: '1.0' },
      meta: undefined,
      links: undefined,
      data: {
        type: 'user',
        attributes: {
          firstName: 'Adriel',
          lastName: 'Wuckert',
          role: 'user',
          email: 'admin3@localhost.com'
        },
        relationships: { documents: { links: undefined, meta: undefined, data: [] } },
        meta: undefined,
        links: undefined
      },
      included: undefined
    });
  })
});

test('It deletes user', async () => {
  const deleteClientId = '9876543210';

  await RequestContext.createAsync(container.resolve(MikroORM).em.fork(), async () => {
    const controllerResult = await controller.delete(deleteClientId, currentUser);
    expect(controllerResult).toBeUndefined();
  })
});
