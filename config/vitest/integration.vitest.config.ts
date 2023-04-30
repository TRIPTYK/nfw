/// <reference types="vitest" />
import { defineConfig } from 'vite'
import baseConfig from './base.config.js';

export default defineConfig({
  ...baseConfig,
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
