import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import { expect, test } from 'vitest';
import { UsersController } from '../../../src/api/controllers/user.controller.js';
import { UserModel } from '../../../src/database/models/user.model.js';
import { Application } from '../../../src/application.js';
import { MikroORM, RequestContext } from '@mikro-orm/core';

test('It creates user', async () => {
  const application = new Application();
  await application.setup();

  const usersController = container.resolve(UsersController);
  const currentUser = new UserModel();

  await RequestContext.createAsync(container.resolve(MikroORM).em.fork(), async () => {
    const controllerResult = await usersController.create({
      firstName: 'amaury'
    }, currentUser);

    expect(controllerResult).toBeTypeOf('string');
  })
});
