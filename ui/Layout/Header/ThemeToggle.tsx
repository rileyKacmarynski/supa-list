import { ActionIcon } from '@mantine/core'
import { IconMoonStars, IconSun } from '@tabler/icons'
import { useTheme } from '../../Theme/ThemeProvider'

const ThemeToggle: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useTheme()

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      size={32}
      data-testid="theme-toggle"
      aria-label={`change to ${
        colorScheme === 'dark' ? 'light' : 'dark'
      } theme`}
    >
      {colorScheme === 'dark' ? (
        <IconSun size={24} />
      ) : (
        <IconMoonStars size={24} />
      )}
    </ActionIcon>
  )
}

export default ThemeToggle
