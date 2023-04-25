import type { Mock } from 'vitest';
import { vi } from 'vitest';

export const mockedEntityRepository: Record<string, Mock> = {
  find: vi.fn(),
  findAll: vi.fn(),
  findAndCount: vi.fn(),
  canPopulate: vi.fn(),
  assign: vi.fn()
};
