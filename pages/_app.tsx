import type { AppProps } from 'next/app'
import React from 'react'
import Layout from '../ui/Layout'
import { ThemeProvider } from '../ui/Theme'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme="dark">
      <Layout header="this is a header" navbar="this is a navbar">
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default MyApp
