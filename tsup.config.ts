import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src', 'src/**/*.tzs', '!src/**/*.spec.ts'],
})
