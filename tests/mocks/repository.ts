import type { Mock } from 'vitest';
import { vi } from 'vitest';

export const mockedEntityRepository = {
  find: vi.fn() as Mock,
  findAll: vi.fn(),
  findOne: vi.fn(),
  findAndCount: vi.fn(),
  canPopulate: vi.fn(),
  assign: vi.fn()
};
