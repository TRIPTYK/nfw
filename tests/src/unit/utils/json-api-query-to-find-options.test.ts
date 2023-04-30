import type { FindOptions } from '@mikro-orm/core';
import type { JsonApiQuery } from '@triptyk/nfw-resources';
import { expect, test } from 'vitest';
import { jsonApiQueryToFindOptions } from '../../../../src/api/utils/json-api-query-to-find-options.js';

test('jsonApiQueryToMikroORM', () => {
  const query: JsonApiQuery = {
    fields: {
      users: ['username', 'lastname']
    },
    page: {
      number: 5,
      size: 2
    },
    include: [
      {
        relationName: 'comments',
        nested: [{
          relationName: 'categories',
          nested: []
        }, {
          relationName: 'tags',
          nested: []
        }]
      }
    ],
    filter: {},
    sort: {
      username: 'ASC',
      'comments.id': 'ASC',
      'comments.username': 'DESC',
      'comments.tags.id': 'DESC'
    }
  }

  expect(jsonApiQueryToFindOptions(query)).toStrictEqual<FindOptions<any, any>>({
    populate: ['comments.categories', 'comments.tags'],
    fields: undefined,
    orderBy: {
      username: 'ASC',
      comments: {
        id: 'ASC',
        username: 'DESC',
        tags: {
          id: 'DESC'
        }
      }
    },
    limit: 2,
    offset: 8
  });
});
