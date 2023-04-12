import 'reflect-metadata';
import { expect, test, vi } from 'vitest';
import { AuthController } from '../../../../src/api/controllers/auth.controller.js';

const configServiceMock = {
  get: vi.fn(),
  load: vi.fn()
} as never;

const refreshTokenRepositoryMock = {} as never;

const userRepositoryMock = {} as never;

const userServiceMock = {} as never;

test('Iogin', async () => {
  const auth = new AuthController(configServiceMock, refreshTokenRepositoryMock, userRepositoryMock, userServiceMock);

  const token = await auth.login({
    password: '123',
    email: 'amaury@gmail.com'
  });

  expect(token).toStrictEqual({});
})
