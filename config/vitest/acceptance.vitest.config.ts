/// <reference types="vitest" />
import { defineConfig } from 'vite';
import baseConfig from './base.config.js';

export default defineConfig({
  ...baseConfig,
  test: {
    include: ['tests/src/acceptance/**/*.test.ts'],
    singleThread: true,
    globals: true,
    logHeapUsage: true,
    globalSetup: [
      'tests/src/acceptance/setup.ts'
    ]
  }
})
