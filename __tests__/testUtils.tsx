import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from '../ui/Theme'

export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>
	  }
	: T

export function renderWithProviders(children: React.ReactNode) {
	return render(<ThemeProvider>{children}</ThemeProvider>)
}
