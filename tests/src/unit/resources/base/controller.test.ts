import 'reflect-metadata';
import { mockedORMImport } from 'tests/mocks/orm-core.js';
import { ForbiddenError } from 'app/api/errors/web/forbidden.js';
import type { JsonApiContext } from 'app/api/resources/base/controller.js';
import { jsonApiGetFunction, jsonApiDeleteFunction, jsonApiUpdateFunction, jsonApiCreateFunction, jsonApiFindAllFunction } from 'app/api/resources/base/controller.js';
import { mockedAuthorizer } from 'tests/mocks/authorizer.js';
import { mockedResourceService } from 'tests/mocks/resource-service.js';
import { mockedSerializer } from 'tests/mocks/serializer.js';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { NotFoundError } from 'app/api/errors/web/not-found.js';

const thisContext: JsonApiContext<{}, {}> = {
  service: mockedResourceService,
  authorizer: mockedAuthorizer,
  serializer: mockedSerializer
}

const currentUser = {} as never;
const existingEntity = {} as never;
const jsonApiQuery = {} as never;

vi.mock('@mikro-orm/core', async () => await mockedORMImport());

afterEach(() => {
  vi.resetAllMocks();
});

describe('Get', () => {
  const id = '123';

  test('Get unexisting user throws error', async () => {
    mockedResourceService.getOne.mockReturnValue(null);

    await expect(() => jsonApiGetFunction.bind(thisContext)(id, jsonApiQuery, currentUser)).rejects.toThrowError();
  });

  test('happy path', async () => {
    mockedAuthorizer.can.mockReturnValue(true);
    mockedResourceService.getOneOrFail.mockReturnValue(existingEntity);

    mockedSerializer.serializeOne.mockReturnValue({});

    await jsonApiGetFunction.bind(thisContext)(id, jsonApiQuery, currentUser);

    expect(mockedResourceService.getOneOrFail).toBeCalledWith(id, jsonApiQuery);
    expect(mockedSerializer.serializeOne).toBeCalledWith(existingEntity, {});
  });

  test('It throws a forbiddenError when not allowed to read user', async () => {
    mockedResourceService.getOneOrFail.mockReturnValue(existingEntity);
    mockedAuthorizer.can.mockReturnValue(false);

    await expect(jsonApiGetFunction.bind(thisContext)(id, jsonApiQuery, currentUser)).rejects.toThrowError(ForbiddenError);
    expect(mockedAuthorizer.can).toBeCalledWith(currentUser, 'read', existingEntity);
  });
});

describe('FindAll', () => {
  test('happy path', async () => {
    const documents = [existingEntity];
    mockedAuthorizer.can.mockReturnValue(true);
    mockedResourceService.getAll.mockReturnValue([documents, 1]);
    mockedSerializer.serializeMany.mockReturnValue({});

    await jsonApiFindAllFunction.bind(thisContext)({}, currentUser)
    expect(mockedSerializer.serializeMany).toBeCalledWith(documents, {}, undefined);
    expect(mockedResourceService.getAll).toBeCalledWith(jsonApiQuery);
  });

  test('Throws when cannot read an element', async () => {
    mockedAuthorizer.can.mockReturnValue(false);
    mockedResourceService.getAll.mockReturnValue([[existingEntity], 1]);
    await expect(jsonApiFindAllFunction.bind(thisContext)({}, currentUser)).rejects.toThrowError(ForbiddenError);
    expect(mockedAuthorizer.can).toBeCalledWith(currentUser, 'read', existingEntity);
  });
});

describe('Create', () => {
  const createBody = {};

  test('happy path', async () => {
    mockedAuthorizer.can.mockReturnValue(true);
    mockedResourceService.create.mockReturnValue(existingEntity);
    mockedSerializer.serializeOne.mockReturnValue({});
    await jsonApiCreateFunction.bind(thisContext)(currentUser, createBody);
    expect(mockedResourceService.create).toBeCalledWith(createBody);
    expect(mockedSerializer.serializeOne).toBeCalledWith(existingEntity, {});
  });

  test('Throws when cannot create an element', async () => {
    mockedAuthorizer.can.mockReturnValue(false);
    mockedResourceService.create.mockReturnValue(existingEntity);
    await expect(jsonApiCreateFunction.bind(thisContext)(currentUser, createBody)).rejects.toThrowError(ForbiddenError);
    expect(mockedAuthorizer.can).toBeCalledWith(currentUser, 'create', createBody);
  });
});

describe('Update', () => {
  const updateBody = {} as never
  const id = '1';

  test('happy path', async () => {
    mockedAuthorizer.can.mockReturnValue(true);
    mockedResourceService.update.mockReturnValue(existingEntity);
    mockedSerializer.serializeOne.mockReturnValue({});
    await jsonApiUpdateFunction.bind(thisContext)(currentUser, updateBody, id);
    expect(mockedSerializer.serializeOne).toBeCalledWith(existingEntity, {});
    expect(mockedResourceService.update).toBeCalledWith(id, updateBody);
  });

  test('Throws when cannot update an element', async () => {
    mockedAuthorizer.can.mockReturnValue(false);
    mockedResourceService.update.mockReturnValue(existingEntity);
    await expect(jsonApiUpdateFunction.bind(thisContext)(currentUser, updateBody, id)).rejects.toThrowError(ForbiddenError);
    expect(mockedAuthorizer.can).toBeCalledWith(currentUser, 'update', updateBody);
  });
});

describe('Delete', () => {
  const id = '1';

  test('happy path', async () => {
    mockedAuthorizer.can.mockReturnValue(true);
    mockedResourceService.getOne.mockReturnValue(existingEntity);
    mockedResourceService.delete.mockReturnValue();
    mockedSerializer.serializeOne.mockReturnValue({});
    await jsonApiDeleteFunction.bind(thisContext)(id, currentUser);
    expect(mockedResourceService.delete).toBeCalledWith(id);
  });

  test('Throws when user does not exists', async () => {
    mockedAuthorizer.can.mockReturnValue(true);
    mockedResourceService.getOneOrFail.mockImplementation(
      () => {
        throw new NotFoundError('Not found')
      },
    );
    await expect(() => jsonApiDeleteFunction.bind(thisContext)(id, currentUser)).rejects.toThrowError(new NotFoundError('Not found'));
  });

  test('Throws when cannot delete an element', async () => {
    mockedAuthorizer.can.mockReturnValue(false);
    mockedResourceService.getOne.mockReturnValue(existingEntity);
    await expect(jsonApiDeleteFunction.bind(thisContext)(id, currentUser)).rejects.toThrowError(ForbiddenError);
  });
});
