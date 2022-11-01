import React, { useCallback, useState } from 'react'
import { AppShell } from '@mantine/core'
import Header from './Header/Header'
import Navbar from './Navbar'
import { useTheme } from '../Theme/ThemeProvider'
export interface LayoutProps {
	children: React.ReactNode
	header: React.ReactElement
	navbar?: React.ReactElement
}

const Layout: React.FC<LayoutProps> = ({ children, header, navbar }) => {
	const theme = useTheme()
	const [opened, setOpened] = useState(false)

	const layoutBackground =
		theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]

	const toggleMenu = useCallback(() => setOpened(o => !o), [])

	return (
		<AppShell
			styles={{
				main: {
					height: '100vh',
					display: 'flex',
					background:
						theme.colorScheme === 'dark'
							? theme.colors.dark[8]
							: theme.colors.gray[1],
				},
			}}
			navbarOffsetBreakpoint="sm"
			asideOffsetBreakpoint="sm"
			navbar={
				navbar && (
					<Navbar menuOpened={opened} sx={{ background: layoutBackground }}>
						{navbar}
					</Navbar>
				)
			}
			header={
				<Header
					toggleMenu={toggleMenu}
					menuOpened={opened}
					sx={{ background: layoutBackground }}
				>
					{header}
				</Header>
			}
		>
			{children}
		</AppShell>
	)
}

export default Layout
