import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import { IconMoonStars, IconSun } from '@tabler/icons'

const ThemeToggle: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  return (
    <ActionIcon
      variant="default"
      onClick={() => toggleColorScheme()}
      size={30}
      data-testid="theme-toggle"
      aria-label={`change to ${
        colorScheme === 'dark' ? 'light' : 'dark'
      } theme`}
    >
      {colorScheme === 'dark' ? (
        <IconSun size={16} />
      ) : (
        <IconMoonStars size={16} />
      )}
    </ActionIcon>
  )
}

export default ThemeToggle
