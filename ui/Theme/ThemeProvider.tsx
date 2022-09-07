import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core'
import { useState } from 'react'

export interface ThemeProps {
  children: React.ReactNode
  theme?: 'light' | 'dark'
}

const ThemeProvider: React.FC<ThemeProps> = ({ children, theme = 'light' }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(theme)
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme }}
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default ThemeProvider
