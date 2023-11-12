import { expect, test, beforeEach } from 'vitest';
import type { UserResourceService } from '../../../../../src/features/users/resources/user/service.js';
import { UserResourceServiceImpl } from '../../../../../src/features/users/resources/user/service.js';
import { UserModel } from '../../../../../src/features/users/models/user.model.js';
import { mockedEntityRepository } from '../../../../mocks/repository.js';

let userResourceService: UserResourceService;
const user = new UserModel();

beforeEach(() => {
  userResourceService = new UserResourceServiceImpl(
    mockedEntityRepository as never
  );
})

test('It applies filters', async () => {
  mockedEntityRepository.findAndCount.mockResolvedValue([]);
  await userResourceService.getAll({
    include: [{
      relationName: 'comments',
      nested: []
    }],
    filter: {
      writtenBy: '1'
    },
    page: {
      size: 1,
      number: 1
    },
    fields: {
      user: ['name']
    },
    sort: {
      name: 'ASC'
    }
  });

  expect(mockedEntityRepository.findAndCount).toBeCalledWith({}, {
    populate: ['comments'],
    filters: {
      writtenBy: '1'
    },
    limit: 1,
    fields: undefined,
    offset: 0,
    orderBy: {
      name: 'ASC'
    }
  });
});

test('Fetch many users resource from database', async () => {
  const findAndCountResponse = [user, 1];
  mockedEntityRepository.findAndCount.mockResolvedValue(findAndCountResponse);

  const response = await userResourceService.getAll({
    include: [{
      relationName: 'comments',
      nested: []
    }],
    page: {
      size: 1,
      number: 1
    },
    fields: {
      user: ['name']
    },
    sort: {
      name: 'ASC'
    }
  });

  expect(mockedEntityRepository.findAndCount).toBeCalledWith({}, {
    populate: ['comments'],
    limit: 1,
    filters: {},
    fields: undefined,
    offset: 0,
    orderBy: {
      name: 'ASC'
    }
  });

  expect(response).toStrictEqual(findAndCountResponse);
});
