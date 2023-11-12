/* eslint-disable import/first */
import 'reflect-metadata';
import { mockedORMImport } from '../../../mocks/orm-core.js';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@mikro-orm/core', async () => await mockedORMImport());

import { UsersController } from '../../../../src/features/users/controllers/users.controller.js';
import { UserModel } from '../../../../src/features/users/models/user.model.js';
import { mockedAuthorizer } from '../../../mocks/authorizer.js';
import { mockedResourceService } from '../../../mocks/resource-service.js';
import { mockedSerializer } from '../../../mocks/serializer.js';
import { ForbiddenError } from '../../../../src/errors/forbidden.js';

const usersService = mockedResourceService;
const serializer = mockedSerializer;
const authorizer = mockedAuthorizer;

let controller: UsersController;

beforeEach(() => {
  controller = new UsersController(
    usersService,
    authorizer,
    serializer
  );
})

afterEach(() => {
  vi.restoreAllMocks();
})

const currentUser = new UserModel();

describe('Get', () => {
  const user = new UserModel();
  const id = '123';
  user.id = id;
  const jsonApiQuery = {};

  test('Get unexisting user throws error', async () => {
    usersService.getOne.mockReturnValue(null);

    await expect(() => controller.get(id, {
      fields: {
        users: ['a']
      }
    }, currentUser)).rejects.toThrowError();
  });

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    usersService.getOneOrFail.mockReturnValue(user as never);

    serializer.serializeOne.mockReturnValue(serializer);

    await controller.get(id, jsonApiQuery, currentUser);

    expect(usersService.getOneOrFail).toBeCalledWith(id, jsonApiQuery);
    expect(serializer.serializeOne).toBeCalledWith({ ...user, resourceType: 'users' }, {}, {
      endpointURL: `users/${id}`
    });
  });

  test('It throws a forbiddenError when not allowed to read user', async () => {
    usersService.getOneOrFail.mockReturnValue(user as never);
    authorizer.can.mockReturnValue(false);

    await expect(controller.get('123', {}, currentUser)).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(currentUser, 'read', user);
  });
});

describe('FindAll', () => {
  const user = new UserModel();
  user.id = '123';
  const jsonApiQuery = {};

  test('happy path', async () => {
    const users = [user];
    authorizer.can.mockReturnValue(true);
    usersService.getAll.mockReturnValue([users, 1]);
    serializer.serializeMany.mockReturnValue(serializer);

    await controller.findAll(jsonApiQuery, currentUser);
    expect(serializer.serializeMany).toBeCalledWith(users.map((u) => ({
      ...u,
      resourceType: 'users'
    })), jsonApiQuery, {
      endpointURL: 'users',
      pagination: undefined
    });
    expect(usersService.getAll).toBeCalledWith(jsonApiQuery);
  });

  test('Throws when cannot read an element', async () => {
    authorizer.can.mockReturnValue(false);
    usersService.getAll.mockReturnValue([[user], 1]);
    await expect(controller.findAll(jsonApiQuery, currentUser)).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(currentUser, 'read', user);
  });
});

describe('Create', () => {
  const user = new UserModel();
  user.id = '123';
  const createBody = {};

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    usersService.create.mockReturnValue(user as never);
    serializer.serializeOne.mockReturnValue(serializer);
    await controller.create(createBody as never, currentUser, {
      fields: {}
    });
    expect(usersService.create).toBeCalledWith(createBody);
    expect(serializer.serializeOne).toBeCalledWith({ ...user, resourceType: 'users' }, {
      fields: {}
    }, {
      endpointURL: `users/${user.id}`
    });
  });

  test('Throws when cannot create an element', async () => {
    authorizer.can.mockReturnValue(false);
    usersService.create.mockReturnValue(user as never);
    await expect(controller.create(createBody as never, currentUser, {})).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(currentUser, 'create', createBody);
  });
});

describe('Update', () => {
  const user = new UserModel();
  const updateBody = {};
  const id = '1';
  user.id = id;

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    usersService.update.mockReturnValue(user as never);
    serializer.serializeOne.mockReturnValue(serializer);
    await controller.update(updateBody, id, currentUser, {});
    expect(serializer.serializeOne).toBeCalledWith({ ...user, resourceType: 'users' }, {}, {
      endpointURL: `users/${id}`
    });
    expect(usersService.update).toBeCalledWith(id, updateBody);
  });

  test('Throws when cannot update an element', async () => {
    authorizer.can.mockReturnValue(false);
    usersService.update.mockReturnValue(user as never);
    await expect(controller.update(updateBody, id, currentUser, {})).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(currentUser, 'update', updateBody);
  });
});

describe('Delete', () => {
  const user = new UserModel();
  const id = '1';

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    usersService.getOne.mockReturnValue(user as never);
    usersService.delete.mockReturnValue();
    serializer.serializeOne.mockReturnValue(serializer);
    await controller.delete(id, currentUser);
    expect(usersService.delete).toBeCalledWith(id);
  });

  test('Throws when cannot delete an element', async () => {
    authorizer.can.mockReturnValue(false);
    usersService.getOne.mockReturnValue(user as never);
    await expect(controller.delete(id, currentUser)).rejects.toThrowError(ForbiddenError);
  });
});
