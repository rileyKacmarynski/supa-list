/// <reference types="vitest" />

import { defineConfig, configDefaults } from 'vitest/config'
import path from 'path'
import react from '@vitejs/plugin-react'

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
