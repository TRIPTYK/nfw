import type { Mock } from 'vitest';
import { vi } from 'vitest';
import type { ResourceAuthorizer } from '../../src/features/shared/resources/base/authorizer.js';

export const mockedAuthorizer = {
  can: vi.fn() as Mock
} satisfies ResourceAuthorizer<never>;
