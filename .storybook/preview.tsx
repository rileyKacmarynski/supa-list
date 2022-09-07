import React from 'react'
import { ThemeProvider } from '../ui/Theme'
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
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  )
}

export const decorators = [withTheme]
