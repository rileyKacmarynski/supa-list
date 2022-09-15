import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React, { useState } from 'react'
import Layout from '../ui/Layout'
import { ThemeProvider } from '../ui/Theme'
import { getUser, User, signOut } from '../services/authService'
import { useEffect } from 'react'
import { Button, Group } from '@mantine/core'
import Link from 'next/link'
import ComponentWrapper from '../ui/Layout/ComponentWrapper'
import UserMenu from '../components/UserMenu'
import { NotificationsProvider } from '@mantine/notifications'

function MyApp({ Component, pageProps, ...appProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const session = getUser()
    setUser(session)
  }, [])

  const isApp = ['/app'].includes(appProps.router.pathname)

  return (
    <ThemeProvider>
      <NotificationsProvider>
        {isApp ? (
          <Layout
            header={<Header user={user} signOut={signOut} />}
            navbar="This is navbar"
          >
            <Component {...pageProps} />
          </Layout>
        ) : (
          <ComponentWrapper>
            <Component {...pageProps} />
          </ComponentWrapper>
        )}
      </NotificationsProvider>
    </ThemeProvider>
  )
}

function Header({ user, signOut }: { user: User | null; signOut: () => void }) {
  return (
    <Group spacing="sm">
      {!user ? (
        <>
          <Link href="login" passHref>
            <Button size="sm" component="a" variant="subtle">
              Log In
            </Button>
          </Link>
          <Link href="register" passHref>
            <Button size="sm" component="a" variant="subtle">
              Register
            </Button>
          </Link>
        </>
      ) : (
        <UserMenu user={user} signOut={signOut} />
      )}
    </Group>
  )
}

export default MyApp
