import tsconfigPaths from 'vite-tsconfig-paths';
import { defineWorkspace } from "vitest/dist/config.js";

export default defineWorkspace([
  {
    plugins: [tsconfigPaths()],
    test: {
      name: 'unit',
      include: ['tests/src/unit/**/*.test.ts'],
      logHeapUsage: true
    },
  },
  {
    plugins: [tsconfigPaths()],
    test: {
      name: 'integration-acceptance',
      include: ['tests/src/{integration,acceptance}/**/*.test.ts'],
      singleThread: true,
      globals: true,
      logHeapUsage: true
    }
  }
]);