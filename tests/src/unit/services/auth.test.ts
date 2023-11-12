import 'reflect-metadata';
import { expect, test, vi, beforeEach, afterAll, beforeAll } from 'vitest';
import { hash } from 'bcrypt';
import { AuthService } from '../../../../src/features/auth/services/auth.service.js';

let service: AuthService;

const BCRYPT_RETURN_VALUE = '';

vi.mock('bcrypt', () => {
  return {
    hash: vi.fn(() => BCRYPT_RETURN_VALUE)
  }
})

const mockTokenRepository = {
  generateRefreshToken: vi.fn()
};

const configurationService = {
  get: vi.fn((key) => {
    switch (key) {
      case 'JWT_SECRET':
        return '123'
      case 'JWT_EXPIRES':
        return 60
      case 'JWT_ISS':
        return 'triptyk.eu'
      case 'JWT_AUDIENCE':
        return 'triptyk.eu'
    }
  })
};

beforeEach(() => {
  service = new AuthService(mockTokenRepository as never, configurationService as never);
});

beforeAll(() => {
  vi.useFakeTimers();
})

afterAll(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
})

test('password hashing', async () => {
  const passwordToHash = '123';
  const expectedRounds = 10;

  const token = await service.hashPassword(passwordToHash);
  expect(token).toStrictEqual(BCRYPT_RETURN_VALUE);
  expect(hash).toBeCalledWith(passwordToHash, expectedRounds);
});

test('access token generation from configuration', () => {
  const date = new Date(949406400000);
  vi.setSystemTime(date)

  const token = service.generateAccessToken('123');

  expect(token).toStrictEqual('eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk0OTQxMDAwMCwiaWF0Ijo5NDk0MDY0MDAsInN1YiI6IjEyMyIsIm5iZiI6OTQ5NDA2Mzk5LCJhdWQiOiJ0cmlwdHlrLmV1IiwiaXNzIjoidHJpcHR5ay5ldSJ9.E3JGmiHu3nmaPGkshxNnjoXGc60CXX0zx7kczhSlin-SlbQXEIyMU4pa1g0ZGL1X53MmtSsczjHxeLQgeDiJcA');
});
