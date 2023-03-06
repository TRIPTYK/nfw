import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import { afterEach, beforeEach, expect } from 'vitest';
import { UsersController } from '../../../src/api/controllers/user.controller.js';
import { setup, teardown } from './setup.js';
import { testCtx } from '../../utils/it-request-context.js';
import { MikroORM } from '@mikro-orm/core';

let controller: UsersController;

beforeEach(async () => {
  await setup();
  controller = container.resolve(UsersController);
})

const emptyFilterQuery = {
  include: [],
  fields: {},
  sort: {},
  filter: undefined,
  page: undefined
};

testCtx('It gets all users with empty filter query', () => container.resolve(MikroORM), async () => {
  const listResult = await controller.list(emptyFilterQuery);

  expect(listResult).toStrictEqual({
    jsonapi: { version: '1.0' },
    meta: undefined,
    links: undefined,
    data: [
      {
        type: 'users',
        id: '12345678910abcdef',
        attributes: undefined,
        relationships: undefined,
        meta: undefined,
        links: undefined
      },
      {
        type: 'users',
        id: '9876543210',
        attributes: undefined,
        relationships: undefined,
        meta: undefined,
        links: undefined
      }
    ],
    included: undefined
  });
});

const filterWithDocuments = {
  include: [{
    relationName: 'documents',
    nested: []
  }],
  fields: {},
  sort: {},
  filter: undefined,
  page: undefined
};

testCtx('It gets all users with documents include', () => container.resolve(MikroORM), async () => {
  const listResult = await controller.list(filterWithDocuments);

  expect(listResult).toStrictEqual({
    jsonapi: { version: '1.0' },
    meta: undefined,
    links: undefined,
    data: [
      {
        type: 'users',
        id: '12345678910abcdef',
        attributes: undefined,
        relationships: {
          documents: {
            links: undefined,
            meta: undefined,
            data: [{ type: 'articles', id: '123456789' }]
          }
        },
        meta: undefined,
        links: undefined
      },
      {
        type: 'users',
        id: '9876543210',
        attributes: undefined,
        relationships: {
          documents: {
            links: undefined,
            meta: undefined,
            data: [{ type: 'articles', id: '123456789' }]
          }
        },
        meta: undefined,
        links: undefined
      }
    ],
    included: undefined
  });
});

testCtx('It gets all users with documents include', () => container.resolve(MikroORM), async () => {
  const listResult = await controller.list(filterWithDocuments);

  expect(listResult).toStrictEqual({
    jsonapi: { version: '1.0' },
    meta: undefined,
    links: undefined,
    data: [
      {
        type: 'users',
        id: '12345678910abcdef',
        attributes: undefined,
        relationships: {
          documents: {
            links: undefined,
            meta: undefined,
            data: [{ type: 'articles', id: '123456789' }]
          }
        },
        meta: undefined,
        links: undefined
      },
      {
        type: 'users',
        id: '9876543210',
        attributes: undefined,
        relationships: {
          documents: {
            links: undefined,
            meta: undefined,
            data: [{ type: 'articles', id: '123456789' }]
          }
        },
        meta: undefined,
        links: undefined
      }
    ],
    included: undefined
  });
});

afterEach(async () => {
  await teardown();
})
