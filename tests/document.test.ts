import fetch from 'node-fetch';
import { FormData } from 'formdata-polyfill/esm.min.js';
import File from 'fetch-blob/file.js';
import type { MikroORM } from '@mikro-orm/core';
import { DocumentModel } from '../src/api/models/document.model.js';
import { existsSync } from 'fs';

const authorizedToken =
  'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUwMDM5MTEwNjUsImlhdCI6MTY0MzkxMDc2NSwic3ViIjoiMTIzNDU2Nzg5MTBhYmNkZWYiLCJuYmYiOjE2NDM5MTA3NjUsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCJ9.D2AP61Td-JLzOwJqnz_YWLVqzF10pcuV3YLo_SjaStMnbpphNx8TzUnJf_ldzDjqj0q69gtLHF9czdja3Mxaxw';

test('Should list documents', async () => {
  const response = await fetch('http://localhost:8001/api/v1/documents', {
    headers: {
      'content-type': 'application/vnd.api+json',
      accept: 'application/vnd.api+json',
      Authorization: `Bearer ${authorizedToken}`,
    },
  });
  expect(response.status).toStrictEqual(200);
});

test('Should get document', async () => {
  const response = await fetch(
    'http://localhost:8001/api/v1/documents/123456789',
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

test('Create document', async () => {
  const formData = new FormData();
  formData.append('file', new File(['abc'], 'hello-world.txt', {
    type: 'text/plain',
  }));
  const response = await fetch('http://localhost:8001/api/v1/documents/', {
    headers: {
      Authorization: `Bearer ${authorizedToken}`,
      accept: 'application/vnd.api+json',
    },
    method: 'post',
    body: formData,
  });
  expect(response.status).toStrictEqual(201);
});

test('Create document with unknown type', async () => {
  const formData = new FormData();
  formData.append('file', new File(['abc'], 'hello-world.gwe', {
    type: 'text/goulagwe',
  }));
  const response = await fetch('http://localhost:8001/api/v1/documents/', {
    headers: {
      Authorization: `Bearer ${authorizedToken}`,
      accept: 'application/vnd.api+json',
    },
    method: 'post',
    body: formData,
  });
  expect(response.status).toStrictEqual(422);
});

test('Replace document', async () => {
  const { container, databaseInjectionToken } = await import('@triptyk/nfw-core');
  const formData = new FormData();
  // We need to fork from the global entity manager otherwise it will not send the rigth value (old value)
  const em = container.resolve<MikroORM>(databaseInjectionToken).em.fork();
  const firstFile = await em.getRepository(DocumentModel).findOne({ id: '123456789' }) as DocumentModel;
  expect(firstFile.path).toStrictEqual('dist/uploads/upload_1');
  expect(existsSync(firstFile.path)).toStrictEqual(true);

  formData.append('file', new File(['abc'], 'hello-world.txt', {
    type: 'text/plain',
  }));
  const response = await fetch('http://localhost:8001/api/v1/documents/123456789', {
    headers: {
      Authorization: `Bearer ${authorizedToken}`,
      accept: 'application/vnd.api+json',
    },
    method: 'put',
    body: formData,
  });

  const newFile = await response.json() as Record<'data', Record<string, string>>;
  // We need to fork from the global entity manager otherwise it will not send the rigth value (old value)
  const replaced = await em.fork().getRepository(DocumentModel).findOneOrFail({ id: newFile.data.id });
  expect(existsSync(firstFile.path)).toStrictEqual(false);
  expect(existsSync(replaced.path)).toStrictEqual(true);
  expect(replaced.path).not.toStrictEqual('dist/uploads/upload_1');

  expect(response.status).toStrictEqual(200);
});

test('Delete document', async () => {
  const { container, databaseInjectionToken } = await import('@triptyk/nfw-core');
  // We need to fork from the global entity manager otherwise it will not send the rigth value (old value)
  const em = container.resolve<MikroORM>(databaseInjectionToken).em.fork();
  const firstFile = await em.getRepository(DocumentModel).findOne({ id: '123456789' }) as DocumentModel;
  expect(firstFile.path).toStrictEqual('dist/uploads/upload_1');
  expect(existsSync(firstFile.path)).toStrictEqual(true);

  const response = await fetch('http://localhost:8001/api/v1/documents/123456789', {
    headers: {
      Authorization: `Bearer ${authorizedToken}`,
      'content-type': 'application/vnd.api+json',
      accept: 'application/vnd.api+json',
    },
    method: 'delete',
  });

  expect(existsSync(firstFile.path)).toStrictEqual(false);

  expect(response.status).toStrictEqual(204);
});
