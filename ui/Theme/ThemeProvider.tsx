import {
	ColorScheme,
	MantineTheme,
	useMantineColorScheme,
	useMantineTheme,
} from '@mantine/core'
import React from 'react'
import MantineProviders from './MantineProviders'

export interface ThemeProps {
	children: React.ReactNode
	theme?: 'light' | 'dark'
	primaryColor: ColorOption
}

export const colorOptions = [
	'grape',
	'indigo',
	'cyan',
	'teal',
	'yellow',
] as const

export type ColorOption = typeof colorOptions[number]

export function randomColorOption(): ColorOption {
	const element = Math.floor(Math.random() * colorOptions.length)
	return colorOptions[element]
}

export interface PrimaryColorContext {
	setPrimaryColor: (color: ColorOption) => void
	primaryColor: ColorOption
}

const ThemeContext = React.createContext<PrimaryColorContext | undefined>(
	undefined,
)

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

const ThemeProvider: React.FC<Optional<ThemeProps, 'primaryColor'>> = ({
	children,
	theme,
	primaryColor = 'grape',
}) => {
	const [primaryColorOption, setPrimaryColorOption] =
		React.useState<ColorOption>(primaryColor)

	const setPrimaryColor = React.useCallback((color: ColorOption) => {
		setPrimaryColorOption(color)
	}, [])

	return (
		<ThemeContext.Provider
			value={{ primaryColor: primaryColorOption, setPrimaryColor }}
		>
			<MantineProviders theme={theme} primaryColor={primaryColorOption}>
				{children}
			</MantineProviders>
		</ThemeContext.Provider>
	)
}

export interface Theme extends MantineTheme {
	colorScheme: ColorScheme
	toggleColorScheme(colorScheme?: ColorScheme): void
	setPrimaryColor: (color: ColorOption) => void
	primaryColorOption: ColorOption
	primaryColor: string
}

export const useTheme: () => Theme = () => {
	const themeContext = React.useContext(ThemeContext)
	if (themeContext === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}

	const colorScheme = useMantineColorScheme()
	const mantineTheme = useMantineTheme()

	const { primaryColor, setPrimaryColor } = themeContext
	const color = mantineTheme.colors[primaryColor][8]

	return {
		...colorScheme,
		...mantineTheme,
		setPrimaryColor,
		primaryColor: color,
		primaryColorOption: primaryColor,
	}
}

export default ThemeProvider
