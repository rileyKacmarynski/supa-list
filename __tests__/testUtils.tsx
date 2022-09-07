import React from 'react'
import { render } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { ThemeProvider } from '../ui/Theme'

export function renderWithProviders(children: React.ReactNode) {
  render(<ThemeProvider>{children}</ThemeProvider>)
}
