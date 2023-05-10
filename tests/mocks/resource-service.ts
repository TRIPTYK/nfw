import type { ResourceService } from 'app/api/resources/base/service.js';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

export const mockedResourceService = {
  getAll: vi.fn() as Mock,
  getOne: vi.fn(),
  getOneOrFail: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
} satisfies ResourceService<never>;
