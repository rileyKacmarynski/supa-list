import { SegmentedControl } from '@mantine/core'
import { useTheme } from '../../Theme/ThemeProvider'

const ThemeToggle: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useTheme()

  const onColorSchemeChange = (scheme: string) => {
    if (scheme !== 'dark' && scheme !== 'light') {
      throw new Error('invalid color scheme')
    }

    toggleColorScheme(scheme)
  }

  return (
    <SegmentedControl
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
