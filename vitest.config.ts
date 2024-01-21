import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: { ...configDefaults, maxConcurrency: 1, passWithNoTests: true },
});
