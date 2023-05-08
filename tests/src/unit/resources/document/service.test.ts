import { expect, test, vi, beforeEach, describe, it } from 'vitest';
import { DocumentResourceServiceImpl } from '../../../../../src/api/resources/documents/service.js';
import { DocumentModel } from '../../../../../src/database/models/document.model.js';

let documentResourceService: DocumentResourceServiceImpl;
const document = new DocumentModel();

const repository = {
  findAndCount: vi.fn(),
  findOne: vi.fn(),
};

beforeEach(() => {
  documentResourceService = new DocumentResourceServiceImpl(
    repository as never,
  );
})

test('Fetch many users resource from database', async () => {
  const findAndCountResponse = [document, 1];
  repository.findAndCount.mockResolvedValue(findAndCountResponse);

  const response = await documentResourceService.getAll({
    include: [{
      relationName: 'users',
      nested: [],
    }],
    page: {
      size: 1,
      number: 1,
    },
    fields: {
      document: ['filename'],
    },
    sort: {
      filename: 'ASC',
    },
  });

  expect(repository.findAndCount).toBeCalledWith({}, {
    populate: ['users'],
    limit: 1,
    filters: {},
    offset: 0,
    orderBy: {
      filename: 'ASC',
    },
  });

  expect(response).toStrictEqual(findAndCountResponse);
});

test('Fetch one user resource from database', async () => {
  const findOneResponse = document;
  repository.findOne.mockResolvedValue(findOneResponse);

  const response = await documentResourceService.getOne('id', {
    include: [{
      relationName: 'users',
      nested: [],
    }],
    page: {
      size: 1,
      number: 1,
    },
    fields: {
      documents: ['filename'],
    },
    sort: {
      filename: 'ASC',
    },
  });

  expect(repository.findOne).toBeCalledWith('id', {
    populate: ['users'],
    limit: 1,
    filters: {},
    offset: 0,
    orderBy: {
      filename: 'ASC',
    },
  });

  expect(response).toStrictEqual(findOneResponse);
});

describe('GetOneOrFail', () => {
  it('Fetch one unexisting error and throw error', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(documentResourceService.getOneOrFail('id', {})).rejects.toThrowError();
  });
})
