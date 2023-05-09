import { mockedAuthorizer } from 'tests/mocks/authorizer.js';
import { beforeEach, expect, test, vi } from 'vitest';
import { ForbiddenError } from '../../../../../src/api/errors/web/forbidden.js';
import { canOrFail } from '../../../../../src/api/utils/can-or-fail.js';

const actor = Symbol('actor');
const action = Symbol('action');
const target = Symbol('target');

beforeEach(() => {
  vi.restoreAllMocks();
});

test('Can or fail calls authorizer.can with correct  arguments', async () => {
  mockedAuthorizer.can.mockReturnValue(true);
  await canOrFail(mockedAuthorizer, actor as never, action as never, target as never);
  expect(mockedAuthorizer.can).toBeCalledWith(actor, action, target)
});

test('Can or fail calls authorizer.can for each target', async () => {
  const target2 = Symbol('target2');
  mockedAuthorizer.can.mockReturnValue(true);
  await canOrFail(mockedAuthorizer, actor as never, action as never, [target, target2] as never);
  expect(mockedAuthorizer.can).toBeCalledWith(actor, action, target);
  expect(mockedAuthorizer.can).toBeCalledTimes(2);
});

test('Can or fail rejects ForbiddenError when authorizer returns false', async () => {
  mockedAuthorizer.can.mockReturnValue(false);
  await expect(() => canOrFail(mockedAuthorizer, actor as never, action as never, target as never)).rejects.toThrowError(ForbiddenError);
  expect(mockedAuthorizer.can).toBeCalledWith(actor, action, target)
});
