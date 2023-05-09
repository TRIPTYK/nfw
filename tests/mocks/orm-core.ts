/**
 * THIS FILE SHOULD BE IMPORTED BEFORE OTHER IMPORTS
 */
import { vi } from 'vitest';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export const mockedORMImport = async (): Promise<typeof import('@mikro-orm/core')> => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const imports = await vi.importActual<typeof import('@mikro-orm/core')>('@mikro-orm/core');
  return {
    ...imports,
    wrap: (data: unknown) => {
      return {
        toJSON: vi.fn().mockReturnValue(data)
      }
    },
    Collection: Array
  } as never
};
