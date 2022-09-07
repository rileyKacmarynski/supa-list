import React from 'react'
import { render } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'

export function renderWithProviders(children: React.ReactNode) {
  render(
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}
    >
      {children}
    </MantineProvider>,
  )
}
