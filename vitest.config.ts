/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import path from 'path'
import { configDefaults, defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // not sure if this works right
      '/': `${path.resolve(__dirname, '/')}`,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['__tests__/setup.ts'],
    exclude: [...configDefaults.exclude, 'tests/*'],
  },
})
