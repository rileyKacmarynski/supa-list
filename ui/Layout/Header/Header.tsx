import {
  Burger,
  Group,
  Header as MantineHeader,
  HeaderProps as MantineHeaderProps,
  MediaQuery,
} from '@mantine/core'
import { useTheme } from '../../Theme/ThemeProvider'
import Logo from './Logo'
import SettingsMenu from './SettingsMenu'

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
  const theme = useTheme()

  return (
    <MantineHeader height={70} p="md" {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            aria-label="navigation menu"
            opened={menuOpened}
            onClick={toggleMenu}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <Group sx={{ height: '100%', width: '100%' }} px={20} position="apart">
          <Logo />
          <Group position="right">
            {children}
            <SettingsMenu />
          </Group>
        </Group>
      </div>
    </MantineHeader>
  )
}

export default Header
