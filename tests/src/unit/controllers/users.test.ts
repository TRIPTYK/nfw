import type { ResourceSerializer, ResourcesRegistry } from '@triptyk/nfw-resources';
import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { UsersController } from '../../../../src/api/controllers/users.controller.js';
import { ForbiddenError } from '../../../../src/api/errors/web/forbidden.js';
import { NotFoundError } from '../../../../src/api/errors/web/not-found.js';
import type { UserResourceAuthorizer } from '../../../../src/api/resources/user/authorizer.js';
import type { UserResourceService } from '../../../../src/api/resources/user/service.js';
import { UserModel } from '../../../../src/database/models/user.model.js';

const usersService = {
  getOne: vi.fn(),
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
} satisfies UserResourceService;

const registry = {
  getDeserializerFor: vi.fn(),
  getSerializerFor: vi.fn(),
  getSchemaFor: vi.fn()
} satisfies ResourcesRegistry;

const authorizer = {
  can: vi.fn()
} satisfies UserResourceAuthorizer;

let controller: UsersController;

beforeEach(() => {
  controller = new UsersController(
    usersService,
    registry,
    authorizer
  );
})

afterEach(() => {
  vi.restoreAllMocks();
})

vi.mock('@mikro-orm/core', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const imports = await vi.importActual<typeof import('@mikro-orm/core')>('@mikro-orm/core')
  return {
    ...imports,
    Collection: Array
  }
})

class Serializer implements ResourceSerializer<never> {
  serializeMany = vi.fn()
  serializeOne = vi.fn()
}

const serializer = new Serializer();

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
    })).rejects.toThrowError();
  });

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    usersService.getOne.mockReturnValue(user);

    registry.getSerializerFor.mockReturnValue(serializer);

    await controller.get(id, jsonApiQuery);

    expect(usersService.getOne).toBeCalledWith(id, jsonApiQuery);
    expect(serializer.serializeOne).toBeCalledWith(user);
  });

  test('It throws a forbiddenError when not allowed to read user', async () => {
    usersService.getOne.mockReturnValue(user);
    authorizer.can.mockReturnValue(false);

    await expect(controller.get('123', {})).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(undefined, 'read', user, {});
  });
});

describe('FindAll', () => {
  const user = new UserModel();
  const jsonApiQuery = {};

  test('happy path', async () => {
    const users = [user];
    authorizer.can.mockReturnValue(true);
    usersService.getAll.mockReturnValue([users, 1]);
    registry.getSerializerFor.mockReturnValue(serializer);

    await controller.findAll(jsonApiQuery);
    expect(serializer.serializeMany).toBeCalledWith(users);
    expect(usersService.getAll).toBeCalledWith(jsonApiQuery);
  });

  test('Throws when cannot read an element', async () => {
    authorizer.can.mockReturnValue(false);
    usersService.getAll.mockReturnValue([[user], 1]);
    await expect(controller.findAll(jsonApiQuery)).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(undefined, 'read', user, {});
  });
});

describe('Create', () => {
  const user = new UserModel();
  const createBody = {};

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    usersService.create.mockReturnValue(user);
    registry.getSerializerFor.mockReturnValue(serializer);
    await controller.create(createBody as never);
    expect(usersService.create).toBeCalledWith(createBody);
    expect(serializer.serializeOne).toBeCalledWith(user);
  });

  test('Throws when cannot create an element', async () => {
    authorizer.can.mockReturnValue(false);
    usersService.create.mockReturnValue(user);
    await expect(controller.create(createBody as never)).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(undefined, 'create', createBody, {});
  });
});

describe('Update', () => {
  const user = new UserModel();
  const updateBody = {};
  const id = '1';

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    usersService.update.mockReturnValue(user);
    registry.getSerializerFor.mockReturnValue(serializer);
    await controller.update(id, updateBody);
    expect(serializer.serializeOne).toBeCalledWith(user);
    expect(usersService.update).toBeCalledWith(id, updateBody);
  });

  test('Throws when cannot update an element', async () => {
    authorizer.can.mockReturnValue(false);
    usersService.update.mockReturnValue(user);
    await expect(controller.update(id, updateBody)).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(undefined, 'update', updateBody, {});
  });
});

describe('Delete', () => {
  const user = new UserModel();
  const id = '1';

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    usersService.getOne.mockReturnValue(user);
    usersService.delete.mockReturnValue(undefined);
    registry.getSerializerFor.mockReturnValue(serializer);
    await controller.delete(id);
    expect(usersService.delete).toBeCalledWith(id);
  });

  test('Throws when user does not exists', async () => {
    authorizer.can.mockReturnValue(true);
    usersService.getOne.mockReturnValue(null);
    await expect(controller.delete(id)).rejects.toThrowError(NotFoundError);
  });

  test('Throws when cannot delete an element', async () => {
    authorizer.can.mockReturnValue(false);
    usersService.getOne.mockReturnValue(user);
    await expect(controller.delete(id)).rejects.toThrowError(ForbiddenError);
  });
});
