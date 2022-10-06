// import { setGlobalConfig } from '@storybook/testing-react'
// import { getWorker } from 'msw-storybook-addon'
// import * as globalStorybookConfig from '../.storybook/preview'

// setGlobalConfig(globalStorybookConfig)

// Ensure MSW connections are closed
// afterAll(() => getWorker().close())

import { vi, afterEach, expect } from 'vitest'
import { cleanup } from '@testing-library/react'
import matchers, {
	TestingLibraryMatchers,
} from '@testing-library/jest-dom/matchers'

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
declare global {
	namespace Vi {
		interface JestAssertion<T = any>
			extends jest.Matchers<void, T>,
				TestingLibraryMatchers<T, void> {}
	}
}
class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}
window.ResizeObserver = ResizeObserver

afterEach(cleanup)

expect.extend(matchers)
