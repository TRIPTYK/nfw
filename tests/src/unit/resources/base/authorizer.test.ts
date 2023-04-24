import { expect, test, vi } from 'vitest';
import { ForbiddenError } from '../../../../../src/api/errors/web/forbidden.js';
import type { ResourceAuthorizer } from '../../../../../src/api/resources/base/authorizer.js';
import { canOrFail } from '../../../../../src/api/utils/can-or-fail.js';

const fakeAuthorizer = {
  can: vi.fn()
} satisfies ResourceAuthorizer<never>;

const actor = Symbol('actor');
const action = Symbol('action');
const target = Symbol('target');
const context = Symbol('context');

test('Can or fail calls authorizer.can with correct  arguments', async () => {
  fakeAuthorizer.can.mockReturnValue(true);
  await canOrFail(fakeAuthorizer, actor as never, action as never, target as never, context as never);
  expect(fakeAuthorizer.can).toBeCalledWith(actor, action, target, context)
});

test('Can or fail rejects ForbiddenError when authorizer returns false', async () => {
  fakeAuthorizer.can.mockReturnValue(false);
  await expect(() => canOrFail(fakeAuthorizer, actor as never, action as never, target as never, context as never)).rejects.toThrowError(ForbiddenError);
  expect(fakeAuthorizer.can).toBeCalledWith(actor, action, target, context)
});
