import { ColorScheme, SegmentedControl } from '@mantine/core'
import { ColorOption } from 'ui/Theme'

export interface ThemeToggleProps {
	colorScheme: ColorScheme
	toggleColorScheme: (scheme: ColorScheme | undefined) => void
	primaryColorOption: ColorOption
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
	colorScheme,
	primaryColorOption,
	toggleColorScheme,
}) => {
	const onColorSchemeChange = (scheme: string) => {
		if (scheme !== 'dark' && scheme !== 'light') {
			throw new Error('invalid color scheme')
		}

		toggleColorScheme(scheme)
	}

	return (
		<SegmentedControl
			color={primaryColorOption}
			aria-labelledby="theme"
			value={colorScheme}
			onChange={onColorSchemeChange}
			data={[
				{ label: 'Light', value: 'light' },
				{ label: 'Dark', value: 'dark' },
			]}
		/>
	)
}

export default ThemeToggle
