import {
  Burger,
  Group,
  Header as MantineHeader,
  HeaderProps as MantineHeaderProps,
  MediaQuery,
  useMantineTheme,
} from '@mantine/core'
import ThemeToggle from './ThemeToggle'

export interface HeaderProps extends Omit<MantineHeaderProps, 'height' | 'p'> {
  menuOpened: boolean
  toggleMenu: () => void
}

const Header: React.FC<HeaderProps> = ({
  menuOpened,
  toggleMenu,
  children,
  ...rest
}) => {
  const theme = useMantineTheme()

  return (
    <MantineHeader height={70} p="md" {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={menuOpened}
            onClick={toggleMenu}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <Group sx={{ height: '100%', width: '100%' }} px={20} position="apart">
          LOGO
          <Group position="right">
            {children}
            <ThemeToggle />
          </Group>
        </Group>
      </div>
    </MantineHeader>
  )
}

export default Header
