import { expect, test, beforeEach } from 'vitest';
import type { UserResourceService } from '../../../../../src/api/resources/user/service.js';
import { UserResourceServiceImpl } from '../../../../../src/api/resources/user/service.js';
import { UserModel } from '../../../../../src/database/models/user.model.js';
import { mockedEntityRepository } from '../../../../utils/mocked-repository.js';

let userResourceService: UserResourceService;
const user = new UserModel();

const repository = mockedEntityRepository;

beforeEach(() => {
  userResourceService = new UserResourceServiceImpl(
    repository as never
  );
})

test('It applies filters', async () => {
  repository.findAndCount.mockResolvedValue([]);
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

  expect(repository.findAndCount).toBeCalledWith({}, {
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
  repository.findAndCount.mockResolvedValue(findAndCountResponse);

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

  expect(repository.findAndCount).toBeCalledWith({}, {
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
