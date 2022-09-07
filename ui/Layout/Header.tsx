import {
  Burger,
  Header as MantineHeader,
  HeaderProps as MantineHeaderProps,
  MediaQuery,
  useMantineTheme,
} from '@mantine/core'

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
        {children}
      </div>
    </MantineHeader>
  )
}

export default Header
