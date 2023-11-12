import 'reflect-metadata';
import { beforeEach, expect, test } from 'vitest';
import { Roles } from '../../../../src/features/users/enums/roles.enum.js';
import { AuthorizeGuard } from '../../../../src/guards/authorize.guard.js';

let guard: AuthorizeGuard;

beforeEach(() => {
  guard = new AuthorizeGuard();
})

test('Returns false when anonymous does not match list', async () => {
  expect(guard.can(undefined, [Roles.ADMIN])).toBe(false);
});

test('Returns false when anonymous and empty list', async () => {
  expect(guard.can(undefined, [])).toBe(false);
});

test('Returns true when logged-in and empty list', async () => {
  expect(guard.can({} as never, [])).toBe(true);
});

test('Returns true when user role matches list', async () => {
  expect(guard.can({
    role: Roles.ADMIN
  } as never, [Roles.ADMIN])).toBe(true);
});

test('Returns false when user role does not matches list', async () => {
  expect(guard.can({
    role: Roles.ADMIN
  } as never, [Roles.USER])).toBe(false);
});
