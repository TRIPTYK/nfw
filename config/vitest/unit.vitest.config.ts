/// <reference types="vitest" />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import baseConfig from './base.config.js';

export default defineConfig({
  ...baseConfig,
  plugins: [tsconfigPaths()],
  test: {
    include: ['tests/src/unit/**/*.test.ts']
  }
})
