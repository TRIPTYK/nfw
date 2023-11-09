import type { ResourceSerializer } from '@triptyk/nfw-resources';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

export const mockedSerializer = {
  serializeMany: vi.fn() as Mock,
  serializeOne: vi.fn()
} satisfies ResourceSerializer;
