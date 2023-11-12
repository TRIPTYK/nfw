import 'reflect-metadata';
import { expect, test, vi } from 'vitest';
import { AuthController } from '../../../../src/features/auth/controllers/auth.controller.js';

const refreshTokenRepositoryMock = {
  getEntityManager: () => ({
    flush: vi.fn()
  })
} as never;

const userRepositoryMock = {
  findOne: vi.fn()
};

const authServiceMock = {
  generateAccessToken: vi.fn(),
  generateRefreshToken: vi.fn()
};

test('Login', async () => {
  const auth = new AuthController(
    refreshTokenRepositoryMock,
    userRepositoryMock as never,
    authServiceMock as never
  );

  userRepositoryMock.findOne.mockReturnValue({
    id: '123',
    passwordMatches: () => true
  });

  authServiceMock.generateAccessToken.mockReturnValue('access');
  authServiceMock.generateRefreshToken.mockReturnValue({
    token: 'refresh'
  });

  const token = await auth.login({
    password: '123',
    email: 'amaury@gmail.com'
  });

  expect(token).toStrictEqual({
    accessToken: 'access',
    refreshToken: 'refresh'
  });
});
