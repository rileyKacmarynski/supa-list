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

const colorOptions = ['grape', 'indigo', 'cyan', 'teal', 'yellow']
export const argTypes = {
  theme: { control: 'select', options: ['light', 'dark'] },
  primaryColor: { control: 'select', options: colorOptions },
}

// The default value of the theme arg to all stories
export const args = { theme: 'dark' }

const withTheme: DecoratorFn = (Story, context) => {
  const { theme, primaryColor } = context.args

  return (
    <ThemeProvider theme={theme} primaryColor={primaryColor}>
      <Story />
    </ThemeProvider>
  )
}

export const decorators = [withTheme]
