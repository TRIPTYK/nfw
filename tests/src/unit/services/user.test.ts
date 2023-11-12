import 'reflect-metadata';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { InvalidBearerTokenError } from '../../../../src/features/auth/errors/invalid-bearer-token.js';
import { UserService } from '../../../../src/features/users/services/user.service.js';
import { mockedEntityRepository } from '../../../mocks/repository.js';

let userService: UserService;

const mockedConfig = {
  get: vi.fn(),
  load: vi.fn()
};

beforeEach(() => {
  userService = new UserService(mockedEntityRepository as never, mockedConfig);
})

test('loading user from unknown token schema throws InvalidBearerTokenError', async () => {
  await expect(() => userService.tryLoadUserFromToken('Auth 123')).rejects.toThrowError(InvalidBearerTokenError);
});

test('loading user with invalid bearer token throws InvalidBearerTokenError', async () => {
  await expect(() => userService.tryLoadUserFromToken('Bearer 123')).rejects.toThrowError(InvalidBearerTokenError);
});

test('loading known user with valid bearer token returns user', async () => {
  const user = {};
  mockedEntityRepository.findOne.mockReturnValue(user);
  mockedConfig.get.mockReturnValue('123');

  const loadedUser = await userService.tryLoadUserFromToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.pF3q46_CLIyP_1QZPpeccbs-hC4n9YW2VMBjKrSO6Wg');
  expect(loadedUser).toStrictEqual(user);
});

afterEach(() => {
  vi.resetAllMocks();
})
