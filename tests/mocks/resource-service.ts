import type { Mock } from 'vitest';
import { vi } from 'vitest';
import type { ResourceService } from '../../src/features/shared/resources/base/service.js';

export const mockedResourceService = {
  getAll: vi.fn() as Mock,
  getOne: vi.fn(),
  getOneOrFail: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
} satisfies ResourceService<never>;
