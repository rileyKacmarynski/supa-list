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

export const argTypes = {
	// this would be nice, but isn't working well with the mantine stuff
	// theme: { control: 'select', options: ['light', 'dark'] },
	// primaryColor: { control: 'select', options: colorOptions },
}

// The default value of the theme arg to all stories
// export const args = { theme: 'dark', primaryColor: 'grape' }

const withTheme: DecoratorFn = (Story, context) => {
	// const { theme, primaryColor } = context.args
	const theme = 'dark'
	const primaryColor = 'grape'

	if (context.parameters.skipLayout) {
		return (
			<ThemeProvider theme={theme} primaryColor={primaryColor}>
				<Story />
			</ThemeProvider>
		)
	}

	return (
		<ThemeProvider theme={theme} primaryColor={primaryColor}>
			<Layout header={<div>header component</div>}>
				<Story />
			</Layout>
		</ThemeProvider>
	)
}

export const decorators = [withTheme]
