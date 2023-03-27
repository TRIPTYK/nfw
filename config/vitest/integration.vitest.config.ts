/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['tests/src/integration/**/*.test.ts'],
    singleThread: true,
    globals: true,
    globalSetup: [
      'tests/src/e2e/setup.ts'
    ]
  }
})
