import { defineWorkspace } from 'vitest/dist/config.js';

// Cannot split integration and acceptance https://github.com/vitest-dev/vitest/issues/3255
export default defineWorkspace([
  {
    plugins: [],
    test: {
      name: 'unit',
      include: ['tests/src/unit/**/*.test.ts']
    },
  },
  {
    plugins: [],
    test: {
      name: 'integration-acceptance',
      include: ['tests/src/{integration,acceptance}/**/*.test.ts'],
      singleThread: true,
      globals: true
    }
  }
]);
