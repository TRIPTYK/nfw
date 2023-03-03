/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['tests/src/integration/**/*.test.ts']
  }
})
