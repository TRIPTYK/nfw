import type { ResourceAuthorizer } from 'app/api/resources/base/authorizer.js';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

export const mockedAuthorizer = {
  can: vi.fn() as Mock
} satisfies ResourceAuthorizer<never>;
