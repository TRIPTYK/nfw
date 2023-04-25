/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['tests/src/integration/**/*.test.ts'],
    singleThread: true,
    globals: true,
    logHeapUsage: true,
    globalSetup: [
      'tests/src/integration/setup.ts'
    ]
  }
})
