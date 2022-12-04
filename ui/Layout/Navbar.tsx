import {
	Navbar as MantineNavbar,
	NavbarProps as MantineNavbarProps,
} from '@mantine/core'
export interface NavbarProps extends MantineNavbarProps {
	menuOpened: boolean
}

const Navbar: React.FC<NavbarProps> = ({ menuOpened, children, ...rest }) => {
	return (
		<MantineNavbar
			hiddenBreakpoint="sm"
			hidden={!menuOpened}
			width={{ sm: 200, lg: 300 }}
			{...rest}
		>
			{children}
		</MantineNavbar>
	)
}

export default Navbar
