import { expect, test, vi, beforeEach } from 'vitest';
import type { UserResourceService } from '../../../../../src/api/resources/user/service.js';
import { UserResourceServiceImpl } from '../../../../../src/api/resources/user/service.js';
import { UserModel } from '../../../../../src/database/models/user.model.js';

let userResourceService: UserResourceService;
const user = new UserModel();

const repository = {
  findAndCount: vi.fn()
}

beforeEach(() => {
  userResourceService = new UserResourceServiceImpl(
    repository as never
  );
})

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
    fields: undefined,
    offset: 0,
    orderBy: {
      name: 'ASC'
    }
  });

  expect(response).toStrictEqual(findAndCountResponse);
});

test('Fetch single user resource from database', async () => {
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
    fields: undefined,
    offset: 0,
    orderBy: {
      name: 'ASC'
    }
  });

  expect(response).toStrictEqual(findAndCountResponse);
});
