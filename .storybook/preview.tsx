import React from 'react'
import { MantineProvider } from '@mantine/core'
import { DecoratorFn } from '@storybook/react'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const argTypes = {
  theme: { control: 'select', options: ['light', 'dark'] },
}

// The default value of the theme arg to all stories
export const args = { theme: 'dark' }

const withTheme: DecoratorFn = (Story, context) => {
  const { theme } = context.args

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: theme }}
    >
      <Story />
    </MantineProvider>
  )
}

export const decorators = [withTheme]
