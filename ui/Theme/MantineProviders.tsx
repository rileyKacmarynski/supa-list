import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core'
import { useColorScheme, useHotkeys, useLocalStorage } from '@mantine/hooks'
import { ThemeProps } from './ThemeProvider'

const MantineProviders: React.FC<ThemeProps> = ({
  children,
  theme,
  primaryColor,
}) => {
  const preferredColorScheme = useColorScheme()
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: theme ? theme : preferredColorScheme,
    getInitialValueInEffect: true,
  })

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  useHotkeys([['mod+J', () => toggleColorScheme()]])

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme, primaryColor }}
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default MantineProviders
