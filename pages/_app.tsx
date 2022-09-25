import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import Layout from '../ui/Layout'
import { ThemeProvider } from '../ui/Theme'
import ComponentWrapper from '../ui/Layout/ComponentWrapper'
import { NotificationsProvider } from '@mantine/notifications'
import AppHeader from 'components/AppHeader'
import AuthProvider from 'lib/auth/AuthContextProvider'
import { client } from 'lib/auth/AuthClient'

function MyApp({ Component, pageProps, ...appProps }: AppProps) {
  const isApp = ['/app'].includes(appProps.router.pathname)

  return (
    <AuthProvider client={client}>
      <ThemeProvider>
        <NotificationsProvider>
          {isApp ? (
            <Layout header={<AppHeader />} navbar="This is navbar">
              <Component {...pageProps} />
            </Layout>
          ) : (
            <ComponentWrapper>
              <Component {...pageProps} />
            </ComponentWrapper>
          )}
        </NotificationsProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default MyApp
