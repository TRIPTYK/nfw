import fetch from 'node-fetch';
import { randomBytes } from 'crypto';
import type { JSONAPIDocument, Linkage, ResourceObject } from 'json-api-serializer';
import { URL } from 'url';

const authorizedToken =
  'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUwMDM5MTEwNjUsImlhdCI6MTY0MzkxMDc2NSwic3ViIjoiMTIzNDU2Nzg5MTBhYmNkZWYiLCJuYmYiOjE2NDM5MTA3NjUsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCJ9.D2AP61Td-JLzOwJqnz_YWLVqzF10pcuV3YLo_SjaStMnbpphNx8TzUnJf_ldzDjqj0q69gtLHF9czdja3Mxaxw';

test('Should list users', async () => {
  const response = await fetch('http://localhost:8001/api/v1/users', {
    headers: {
      'content-type': 'application/vnd.api+json',
      accept: 'application/vnd.api+json',
      Authorization: `Bearer ${authorizedToken}`,
    },
  });
  expect(response.status).toStrictEqual(200);
});

test('Should get profile', async () => {
  const response = await fetch('http://localhost:8001/api/v1/users/profile', {
    headers: {
      'content-type': 'application/vnd.api+json',
      accept: 'application/vnd.api+json',
      Authorization: `Bearer ${authorizedToken}`,
    },
  });
  expect(response.status).toStrictEqual(200);
});

test('Should get user', async () => {
  const response = await fetch(
    'http://localhost:8001/api/v1/users/12345678910abcdef',
    {
      headers: {
        'content-type': 'application/vnd.api+json',
        accept: 'application/vnd.api+json',
        Authorization: `Bearer ${authorizedToken}`,
      },
    },
  );
  expect(response.status).toStrictEqual(200);
});

describe('JSON-API tests', () => {
  test('Should get user with include documents', async () => {
    const response = await fetch(
      'http://localhost:8001/api/v1/users/12345678910abcdef?include=documents',
      {
        headers: {
          'content-type': 'application/vnd.api+json',
          accept: 'application/vnd.api+json',
          Authorization: `Bearer ${authorizedToken}`,
        },
      },
    );
    const json = await response.json() as JSONAPIDocument;
    const data = json.data as ResourceObject<unknown>;
    expect(response.status).toStrictEqual(200);
    expect(data.id).toStrictEqual('12345678910abcdef');
    expect(Array.isArray(data.relationships?.documents.data)).toStrictEqual(true);
    expect((data.relationships?.documents.data as Linkage[]).length).toStrictEqual(1);
    expect(json.included?.length).toStrictEqual(1);
  });
  test('Should refuse unknown include', async () => {
    const response = await fetch(
      'http://localhost:8001/api/v1/users/12345678910abcdef?include=documentsssss',
      {
        headers: {
          'content-type': 'application/vnd.api+json',
          accept: 'application/vnd.api+json',
          Authorization: `Bearer ${authorizedToken}`,
        },
      },
    );
    expect(response.status).toStrictEqual(400);
  });
  test('Should get user with only firstName field', async () => {
    const response = await fetch(
      'http://localhost:8001/api/v1/users/12345678910abcdef?fields[users]=firstName',
      {
        headers: {
          'content-type': 'application/vnd.api+json',
          accept: 'application/vnd.api+json',
          Authorization: `Bearer ${authorizedToken}`,
        },
      },
    );
    const json = await response.json() as JSONAPIDocument;
    const data = json.data as ResourceObject<unknown>;
    expect(response.status).toStrictEqual(200);
    expect(data.id).toStrictEqual('12345678910abcdef');
    expect(data.attributes).toMatchObject({
      firstName: 'amaury',
    });
    expect(json.included).toBeUndefined();
  });
  test('Should refuse unknown field', async () => {
    const response = await fetch(
      'http://localhost:8001/api/v1/users/12345678910abcdef?fields=azdlpazlda',
      {
        headers: {
          'content-type': 'application/vnd.api+json',
          accept: 'application/vnd.api+json',
          Authorization: `Bearer ${authorizedToken}`,
        },
      },
    );
    expect(response.status).toStrictEqual(400);
  });
  test('Should order by id', async () => {
    const response = await fetch(
      'http://localhost:8001/api/v1/users?sort=-id',
      {
        headers: {
          'content-type': 'application/vnd.api+json',
          accept: 'application/vnd.api+json',
          Authorization: `Bearer ${authorizedToken}`,
        },
      },
    );
    expect(response.status).toStrictEqual(200);
    const json = await response.json() as JSONAPIDocument;
    const data = json.data as ResourceObject<unknown>[];
    expect(data.length).toStrictEqual(2);
    expect(data[0].id).toStrictEqual('9876543210');
  });
  test('Should refuse unknown order key', async () => {
    const response = await fetch(
      'http://localhost:8001/api/v1/users?sort=-ids',
      {
        headers: {
          'content-type': 'application/vnd.api+json',
          accept: 'application/vnd.api+json',
          Authorization: `Bearer ${authorizedToken}`,
        },
      },
    );
    expect(response.status).toStrictEqual(400);
  });
  test('Should paginate', async () => {
    const response = await fetch(
      'http://localhost:8001/api/v1/users?page[size]=1&page[number]=1',
      {
        headers: {
          'content-type': 'application/vnd.api+json',
          accept: 'application/vnd.api+json',
          Authorization: `Bearer ${authorizedToken}`,
        },
      },
    );
    const json = await response.json() as JSONAPIDocument;
    const data = json.data as ResourceObject<unknown>[];
    expect(response.status).toStrictEqual(200);
    expect(data.length).toStrictEqual(1);

    const links = json.links as Record<'self' | 'first' | 'last' | 'prev' | 'next', string>;

    // we don't care about the base URL, but it s needed
    const self = new URL(links.self, 'http://localhost');
    const first = new URL(links.first, 'http://localhost');
    const last = new URL(links.last, 'http://localhost');
    const previous = new URL(links.prev, 'http://localhost');
    const next = new URL(links.next, 'http://localhost');

    expect(self.searchParams.get('page[number]')).toStrictEqual('1');
    expect(first.searchParams.get('page[number]')).toStrictEqual('1');
    expect(last.searchParams.get('page[number]')).toStrictEqual('2');
    expect(next.searchParams.get('page[number]')).toStrictEqual('2');
    expect(previous.searchParams.get('page[number]')).toStrictEqual('1');
  });
});

test('Should create user', async () => {
  const response = await fetch(
    'http://localhost:8001/api/v1/users',
    {
      method: 'post',
      body: JSON.stringify({
        data: {
          attributes: {
            password: '123',
            role: 'admin',
            lastName: 'amaury',
            firstName: 'amaury',
            email: 'amaury@email.com',
          },
        },
      }),
      headers: {
        'content-type': 'application/vnd.api+json',
        accept: 'application/vnd.api+json',
        Authorization: `Bearer ${authorizedToken}`,
      },
    },
  );
  expect(response.status).toStrictEqual(201);
});

test('Create user with unknown key', async () => {
  const response = await fetch(
    'http://localhost:8001/api/v1/users',
    {
      method: 'post',
      body: JSON.stringify({
        data: {
          attributes: {
            unknown: '123',
            password: '123',
            role: 'admin',
            lastName: 'amaury',
            firstName: 'amaury',
            email: 'amaury@email.com',
          },
        },
      }),
      headers: {
        'content-type': 'application/vnd.api+json',
        accept: 'application/vnd.api+json',
        Authorization: `Bearer ${authorizedToken}`,
      },
    },
  );
  expect(response.status).toStrictEqual(400);
});

test('Should update user', async () => {
  const response = await fetch(
    'http://localhost:8001/api/v1/users/12345678910abcdef',
    {
      method: 'patch',
      body: JSON.stringify({
        data: {
          attributes: {
            lastName: 'amaury',
            firstName: 'amaury',
          },
        },
      }),
      headers: {
        'content-type': 'application/vnd.api+json',
        accept: 'application/vnd.api+json',
        Authorization: `Bearer ${authorizedToken}`,
      },
    },
  );
  expect(response.status).toStrictEqual(200);
});

test('Should delete user', async () => {
  const response = await fetch(
    'http://localhost:8001/api/v1/users/12345678910abcdef',
    {
      method: 'DELETE',
      headers: {
        'content-type': 'application/vnd.api+json',
        accept: 'application/vnd.api+json',
        Authorization: `Bearer ${authorizedToken}`,
      },
    },
  );
  expect(response.status).toStrictEqual(204);
});

test('Should get unexisting user', async () => {
  const response = await fetch('http://localhost:8001/api/v1/users/1234bcdef', {
    headers: {
      'content-type': 'application/vnd.api+json',
      accept: 'application/vnd.api+json',
      Authorization: `Bearer ${authorizedToken}`,
    },
  });
  expect(response.status).toStrictEqual(404);
});

test('Should refuse unauthorized user', async () => {
  const response = await fetch('http://localhost:8001/api/v1/users', {
    headers: {
      'content-type': 'application/vnd.api+json',
      accept: 'application/vnd.api+json',
    },
  });
  expect(response.status).toStrictEqual(401);
});

test('Should refuse wrong content-type', async () => {
  const response = await fetch('http://localhost:8001/api/v1/users', {
    headers: {
      'content-type': 'application/nd.api+json',
      accept: 'application/vnd.api+json',
    },
  });
  expect(response.status).toStrictEqual(415);
});

test('Should refuse good content-type but with media chars', async () => {
  const response = await fetch('http://localhost:8001/api/v1/users', {
    headers: {
      'content-type': 'application/vnd.api+json; encoding=UTF-8',
      accept: 'application/vnd.api+json',
    },
  });
  expect(response.status).toStrictEqual(406);
});

test('Should refuse wrong accept', async () => {
  const response = await fetch('http://localhost:8001/api/v1/users', {
    headers: {
      'content-type': 'application/vnd.api+json',
      accept: 'application/json',
    },
  });
  expect(response.status).toStrictEqual(406);
});

test('Should deny > 128kb payloads', async () => {
  const bytes = randomBytes(131073);
  const response = await fetch('http://localhost:8001/api/v1/users', {
    method: 'post',
    headers: {
      'content-type': 'application/vnd.api+json',
      accept: 'application/vnd.api+json',
    },
    body: JSON.stringify({ bytes: bytes.toString('hex') }),
  });
  expect(response.status).toStrictEqual(413);
});
