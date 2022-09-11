import '../styles/globals.css'
import React from 'react'
import { ThemeProvider } from '../ui/Theme'
import { DecoratorFn } from '@storybook/react'
import Layout from '../ui/Layout'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const colorOptions = ['grape', 'indigo', 'cyan', 'teal', 'yellow']
export const argTypes = {
  // this would be nice, but isn't working well with the mantine stuff
  // theme: { control: 'select', options: ['light', 'dark'] },
  // primaryColor: { control: 'select', options: colorOptions },
}

// The default value of the theme arg to all stories
export const args = { theme: 'dark' }

const withTheme: DecoratorFn = (Story, context) => {
  const { theme, primaryColor } = context.args

  console.log(context)
  if (context.parameters.skipLayout) {
    return (
      <ThemeProvider theme={theme} primaryColor={primaryColor}>
        <Story />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme} primaryColor={primaryColor}>
      <Layout header="This is a header" navbar="This is a navbar">
        <Story />
      </Layout>
    </ThemeProvider>
  )
}

export const decorators = [withTheme]
