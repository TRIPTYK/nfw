import { expect, test, beforeEach, describe, it } from 'vitest';
import { DocumentResourceServiceImpl } from '../../../../../src/features/users/resources/documents/service.js';
import { DocumentModel } from '../../../../../src/features/users/models/document.model.js';
import { mockedEntityRepository } from '../../../../mocks/repository.js';

let documentResourceService: DocumentResourceServiceImpl;
const document = new DocumentModel();

beforeEach(() => {
  documentResourceService = new DocumentResourceServiceImpl(
    mockedEntityRepository as never,
  );
})

test('Fetch many users resource from database', async () => {
  const findAndCountResponse = [document, 1];
  mockedEntityRepository.findAndCount.mockResolvedValue(findAndCountResponse);

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

  expect(mockedEntityRepository.findAndCount).toBeCalledWith({}, {
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
  mockedEntityRepository.findOne.mockResolvedValue(findOneResponse);

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

  expect(mockedEntityRepository.findOne).toBeCalledWith('id', {
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
    mockedEntityRepository.findOne.mockResolvedValue(null);
    await expect(documentResourceService.getOneOrFail('id', {})).rejects.toThrowError();
  });
})
