import 'reflect-metadata';
import type { ResourceSerializer } from '@triptyk/nfw-resources';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { UsersController } from 'app/api/controllers/users.controller.js';
import { ForbiddenError } from 'app/api/errors/web/forbidden.js';
import type { UserResourceAuthorizer } from 'app/api/resources/user/authorizer.js';
import type { UserResourceService } from 'app/api/resources/user/service.js';
import { UserModel } from 'app/database/models/user.model.js';
import type { UserResource } from 'app/api/resources/user/schema.js';

const usersService = {
  getOne: vi.fn(),
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getOneOrFail: vi.fn()
} satisfies UserResourceService;

const serializer = {
  serializeOne: vi.fn(),
  serializeMany: vi.fn()
} satisfies ResourceSerializer<UserResource>;

const authorizer = {
  can: vi.fn()
} satisfies UserResourceAuthorizer;

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

vi.mock('@mikro-orm/core', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const imports = await vi.importActual<typeof import('@mikro-orm/core')>('@mikro-orm/core');
  return {
    ...imports,
    wrap: (data: unknown) => {
      return {
        toJSON: vi.fn().mockReturnValue(data)
      }
    },
    Collection: Array
  }
})

const currentUser = new UserModel();

describe('Get', () => {
  const user = new UserModel();
  const id = '123';
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
    usersService.getOneOrFail.mockReturnValue(user);

    serializer.serializeOne.mockReturnValue(serializer);

    await controller.get(id, jsonApiQuery, currentUser);

    expect(usersService.getOneOrFail).toBeCalledWith(id, jsonApiQuery);
    expect(serializer.serializeOne).toBeCalledWith(user, {});
  });

  test('It throws a forbiddenError when not allowed to read user', async () => {
    usersService.getOneOrFail.mockReturnValue(user);
    authorizer.can.mockReturnValue(false);

    await expect(controller.get('123', {}, currentUser)).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(currentUser, 'read', user);
  });
});

describe('FindAll', () => {
  const user = new UserModel();
  const jsonApiQuery = {};

  test('happy path', async () => {
    const users = [user];
    authorizer.can.mockReturnValue(true);
    usersService.getAll.mockReturnValue([users, 1]);
    serializer.serializeMany.mockReturnValue(serializer);

    await controller.findAll(jsonApiQuery, currentUser);
    expect(serializer.serializeMany).toBeCalledWith(users, jsonApiQuery, undefined);
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
  const createBody = {};

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    usersService.create.mockReturnValue(user);
    serializer.serializeOne.mockReturnValue(serializer);
    await controller.create(createBody as never, currentUser);
    expect(usersService.create).toBeCalledWith(createBody);
    expect(serializer.serializeOne).toBeCalledWith(user, {});
  });

  test('Throws when cannot create an element', async () => {
    authorizer.can.mockReturnValue(false);
    usersService.create.mockReturnValue(user);
    await expect(controller.create(createBody as never, currentUser)).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(currentUser, 'create', createBody);
  });
});

describe('Update', () => {
  const user = new UserModel();
  const updateBody = {};
  const id = '1';

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    usersService.update.mockReturnValue(user);
    serializer.serializeOne.mockReturnValue(serializer);
    await controller.update(updateBody, id, currentUser);
    expect(serializer.serializeOne).toBeCalledWith(user, {});
    expect(usersService.update).toBeCalledWith(id, updateBody);
  });

  test('Throws when cannot update an element', async () => {
    authorizer.can.mockReturnValue(false);
    usersService.update.mockReturnValue(user);
    await expect(controller.update(updateBody, id, currentUser)).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(currentUser, 'update', updateBody);
  });
});

describe('Delete', () => {
  const user = new UserModel();
  const id = '1';

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    usersService.getOne.mockReturnValue(user);
    usersService.delete.mockReturnValue();
    serializer.serializeOne.mockReturnValue(serializer);
    await controller.delete(id, currentUser);
    expect(usersService.delete).toBeCalledWith(id);
  });

  test('Throws when cannot delete an element', async () => {
    authorizer.can.mockReturnValue(false);
    usersService.getOne.mockReturnValue(user);
    await expect(controller.delete(id, currentUser)).rejects.toThrowError(ForbiddenError);
  });
});
