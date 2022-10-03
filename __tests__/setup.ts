// import { setGlobalConfig } from '@storybook/testing-react'
// import { getWorker } from 'msw-storybook-addon'
// import * as globalStorybookConfig from '../.storybook/preview'

// setGlobalConfig(globalStorybookConfig)

// Ensure MSW connections are closed
// afterAll(() => getWorker().close())
import { vi } from 'vitest'

// I think this is something mantine uses
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver

export {}
