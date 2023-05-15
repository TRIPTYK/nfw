import { mockedORMImport } from 'tests/mocks/orm-core.js';
import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { DocumentsController } from '../../../../src/api/controllers/documents.controller.js';
import { ForbiddenError } from '../../../../src/api/errors/web/forbidden.js';
import { DocumentModel } from '../../../../src/database/models/document.model.js';
import { UserModel } from '../../../../src/database/models/user.model.js';
import { NotFoundError } from '@mikro-orm/core';
import { mockedResourceService } from 'tests/mocks/resource-service.js';
import { mockedSerializer } from 'tests/mocks/serializer.js';
import { mockedAuthorizer } from 'tests/mocks/authorizer.js';

const service = mockedResourceService;
const serializer = mockedSerializer;
const authorizer = mockedAuthorizer;

let controller: DocumentsController;

beforeEach(() => {
  controller = new DocumentsController(
    service,
    serializer,
    authorizer,
  );
})

afterEach(() => {
  vi.restoreAllMocks();
})

vi.mock('@mikro-orm/core', async () => await mockedORMImport());

const currentUser = new UserModel();

describe('Get', () => {
  const document = new DocumentModel();
  const id = '123';
  const jsonApiQuery = {};

  test('Get unexisting document throws error', async () => {
    service.getOneOrFail.mockImplementation(() => {
      throw new NotFoundError('Not found')
    });

    await expect(() => controller.get(id, {
      fields: {
        documents: ['filename'],
      },
    }, currentUser)).rejects.toThrowError();
  });

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    service.getOneOrFail.mockReturnValue(document as never);

    serializer.serializeOne.mockReturnValue(serializer);

    await controller.get(id, jsonApiQuery, currentUser);

    expect(service.getOneOrFail).toBeCalledWith(id, jsonApiQuery);
    expect(serializer.serializeOne).toBeCalledWith(document, {}, {
      endpointURL: 'documents/123',
      pagination: undefined
    });
  });

  test('It throws a forbiddenError when not allowed to read user', async () => {
    service.getOneOrFail.mockReturnValue(document as never);
    authorizer.can.mockReturnValue(false)

    await expect(controller.get('123', {}, currentUser)).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(currentUser, 'read', document);
  });
});

describe('FindAll', () => {
  const document = new DocumentModel();
  const jsonApiQuery = {};

  test('happy path', async () => {
    const documents = [document];
    authorizer.can.mockReturnValue(true);
    service.getAll.mockReturnValue([documents, 1]);
    serializer.serializeMany.mockReturnValue(serializer);

    await controller.findAll(jsonApiQuery, currentUser);
    expect(serializer.serializeMany).toBeCalledWith(documents, {}, {
      endpointURL: 'documents',
      pagination: undefined
    });
    expect(service.getAll).toBeCalledWith(jsonApiQuery);
  });

  test('Throws when cannot read an element', async () => {
    authorizer.can.mockReturnValue(false);
    service.getAll.mockReturnValue([[document], 1]);
    await expect(controller.findAll(jsonApiQuery, currentUser)).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(currentUser, 'read', document);
  });
});

describe('Create', () => {
  const document = new DocumentModel();
  const createBody = {};

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    service.create.mockReturnValue(document as never);
    serializer.serializeOne.mockReturnValue(serializer);
    await controller.create(createBody as never, currentUser);
    expect(service.create).toBeCalledWith(createBody);
    expect(serializer.serializeOne).toBeCalledWith(document, {}, {
      endpointURL: 'documents',
      pagination: undefined
    });
  });

  test('Throws when cannot create an element', async () => {
    authorizer.can.mockReturnValue(false);
    service.create.mockReturnValue(document as never);
    await expect(controller.create(createBody as never, currentUser)).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(currentUser, 'create', createBody);
  });
});

describe('Update', () => {
  const document = new DocumentModel();
  const updateBody = {} as never
  const id = '1';

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    service.update.mockReturnValue(document as never);
    serializer.serializeOne.mockReturnValue(serializer);
    await controller.update(id, updateBody, currentUser);
    expect(serializer.serializeOne).toBeCalledWith(document, {}, {
      endpointURL: 'documents/1',
      pagination: undefined
    });
    expect(service.update).toBeCalledWith(id, updateBody);
  });

  test('Throws when cannot update an element', async () => {
    authorizer.can.mockReturnValue(false);
    service.update.mockReturnValue(document as never);
    await expect(controller.update(id, updateBody, currentUser)).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(currentUser, 'update', updateBody);
  });
});

describe('Delete', () => {
  const document = new DocumentModel();
  const id = '1';

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    service.getOne.mockReturnValue(document as never);
    service.delete.mockReturnValue();
    serializer.serializeOne.mockReturnValue(serializer);
    await controller.delete(id, currentUser);
    expect(service.delete).toBeCalledWith(id);
  });

  test('Throws when user does not exists', async () => {
    authorizer.can.mockReturnValue(true);
    service.getOneOrFail.mockImplementation(
      () => {
        throw new NotFoundError('Not found')
      },
    );
    await expect(() => controller.delete(id, currentUser)).rejects.toThrowError(new NotFoundError('Not found'));
  });

  test('Throws when cannot delete an element', async () => {
    authorizer.can.mockReturnValue(false);
    service.getOne.mockReturnValue(document as never);
    await expect(controller.delete(id, currentUser)).rejects.toThrowError(ForbiddenError);
  });
});
