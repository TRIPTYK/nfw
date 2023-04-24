import { vi } from 'vitest';

export const mockedEntityRepository = {
  find: vi.fn(),
  findAll: vi.fn(),
  findAndCount: vi.fn(),
  canPopulate: vi.fn(),
  assign: vi.fn()
};
