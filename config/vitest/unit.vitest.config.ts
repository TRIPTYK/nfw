/// <reference types="vitest" />
import { defineConfig } from 'vite';
import baseConfig from './base.config.js';

export default defineConfig({
  ...baseConfig,
  test: {
    include: ['tests/src/unit/**/*.test.ts']
  }
})
