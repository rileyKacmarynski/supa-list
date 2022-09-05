import React, { useCallback, useState } from 'react'
import {
  AppShell,
  Navbar as MantineNavbar,
  NavbarProps as MantineNavbarProps,
  Text,
  useMantineTheme,
} from '@mantine/core'
import Header from './Header'
import Navbar from './Navbar'

export interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)

  const layoutBackground =
    theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]

  const toggleMenu = useCallback(() => setOpened(o => !o), [])

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[1],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar menuOpened={opened} sx={{ background: layoutBackground }} />
      }
      header={
        <Header
          toggleMenu={toggleMenu}
          menuOpened={opened}
          sx={{ background: layoutBackground }}
        />
      }
    >
      {children}
    </AppShell>
  )
}

export default Layout
