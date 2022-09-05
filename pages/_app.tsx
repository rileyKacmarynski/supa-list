import { MantineProvider } from '@mantine/core'
import type { AppProps } from 'next/app'
import Layout from '../ui/Layout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MantineProvider>
  )
}

export default MyApp
