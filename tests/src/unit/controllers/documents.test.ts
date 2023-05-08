import type { ResourcesRegistry, ResourceSerializer } from '@triptyk/nfw-resources';
import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { DocumentsController } from '../../../../src/api/controllers/documents.controller.js';
import { ForbiddenError } from '../../../../src/api/errors/web/forbidden.js';
import type { DocumentResourceService } from '../../../../src/api/resources/documents/service.js';
import { DocumentModel } from '../../../../src/database/models/document.model.js';
import { UserModel } from '../../../../src/database/models/user.model.js';
import { NotFoundError } from '@mikro-orm/core';
import type { ResourceAuthorizer } from '../../../../src/api/resources/base/authorizer.js';

const service = {
  getOne: vi.fn(),
  getOneOrFail: vi.fn(),
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
} satisfies DocumentResourceService;

const registry = {
  getDeserializerFor: vi.fn(),
  getSerializerFor: vi.fn(),
  getSchemaFor: vi.fn(),
  getConfig: vi.fn(),
} satisfies ResourcesRegistry;

const authorizer = {
  can: vi.fn(),
} satisfies ResourceAuthorizer<DocumentModel>;

let controller: DocumentsController;

beforeEach(() => {
  controller = new DocumentsController(
    service,
    registry,
    authorizer,
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
    wrap: (data: unknown) => {
      return {
        toJSON: vi.fn().mockReturnValue(data)
      }
    },
    Collection: Array,
  }
})

class Serializer implements ResourceSerializer<never> {
  serializeMany = vi.fn()
  serializeOne = vi.fn()
}

const serializer = new Serializer();
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
    service.getOneOrFail.mockReturnValue(document);

    registry.getSerializerFor.mockReturnValue(serializer);

    await controller.get(id, jsonApiQuery, currentUser);

    expect(service.getOneOrFail).toBeCalledWith(id, jsonApiQuery);
    expect(serializer.serializeOne).toBeCalledWith(document, {});
  });

  test('It throws a forbiddenError when not allowed to read user', async () => {
    service.getOneOrFail.mockReturnValue(document);
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
    registry.getSerializerFor.mockReturnValue(serializer);

    await controller.findAll(jsonApiQuery, currentUser);
    expect(serializer.serializeMany).toBeCalledWith(documents, {});
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
    service.create.mockReturnValue(document);
    registry.getSerializerFor.mockReturnValue(serializer);
    await controller.create(createBody as never, currentUser);
    expect(service.create).toBeCalledWith(createBody);
    expect(serializer.serializeOne).toBeCalledWith(document, {});
  });

  test('Throws when cannot create an element', async () => {
    authorizer.can.mockReturnValue(false);
    service.create.mockReturnValue(document);
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
    service.update.mockReturnValue(document);
    registry.getSerializerFor.mockReturnValue(serializer);
    await controller.update(id, updateBody, currentUser);
    expect(serializer.serializeOne).toBeCalledWith(document, {});
    expect(service.update).toBeCalledWith(id, updateBody);
  });

  test('Throws when cannot update an element', async () => {
    authorizer.can.mockReturnValue(false);
    service.update.mockReturnValue(document);
    await expect(controller.update(id, updateBody, currentUser)).rejects.toThrowError(ForbiddenError);
    expect(authorizer.can).toBeCalledWith(currentUser, 'update', updateBody);
  });
});

describe('Delete', () => {
  const document = new DocumentModel();
  const id = '1';

  test('happy path', async () => {
    authorizer.can.mockReturnValue(true);
    service.getOne.mockReturnValue(document);
    service.delete.mockReturnValue();
    registry.getSerializerFor.mockReturnValue(serializer);
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
    service.getOne.mockReturnValue(document);
    await expect(controller.delete(id, currentUser)).rejects.toThrowError(ForbiddenError);
  });
});
