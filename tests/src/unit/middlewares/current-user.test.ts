import 'reflect-metadata';
import { expect, test, vi } from 'vitest';
import { CurrentUserMiddleware } from '../../../../src/middlewares/current-user.middleware.js';

const mockUserService = {
  tryLoadUserFromToken: vi.fn(),
}

test('current-user middleware is called with authorization header and calls tryLoadUserFromToken', async () => {
  const currentUserMiddleware = new CurrentUserMiddleware(mockUserService as never);
  const next = vi.fn();
  const context = {
    state: {},
    headers: {
      authorization: 'Auth_Bearer',
    },
  } as any;
  const loadedUser = {};

  mockUserService.tryLoadUserFromToken.mockReturnValue(loadedUser);
  await currentUserMiddleware.use(context, next);
  expect(context.state.user).toStrictEqual(loadedUser);
  expect(mockUserService.tryLoadUserFromToken).toBeCalledWith('Auth_Bearer');
})
