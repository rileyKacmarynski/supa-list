import {
  Navbar as MantineNavbar,
  NavbarProps as MantineNavbarProps,
  Text,
} from '@mantine/core'

export interface NavbarProps extends Omit<MantineNavbarProps, 'children'> {
  menuOpened: boolean
}

const Navbar: React.FC<NavbarProps> = ({ menuOpened, ...rest }) => {
  return (
    <MantineNavbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!menuOpened}
      width={{ sm: 200, lg: 300 }}
      {...rest}
    >
      <Text>Application navbar</Text>
    </MantineNavbar>
  )
}

export default Navbar
