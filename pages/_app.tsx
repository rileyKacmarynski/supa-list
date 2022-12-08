import { NotificationsProvider } from '@mantine/notifications'
import AppHeader from 'components/AppHeader'
import { authClient } from 'lib/auth/AuthClient'
import AuthProvider from 'lib/auth/AuthContextProvider'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import Layout from '../ui/Layout'
import { ThemeProvider } from '../ui/Theme'

if (process.env.NEXT_PUBLIC_API_MOCKING == 'true') {
	import('../mocks')
}

function MyApp({ Component, pageProps, ...appProps }: AppProps) {
	const isApp = ['/app'].includes(appProps.router.pathname)

	return (
		<AuthProvider client={authClient}>
			<ThemeProvider>
				<NotificationsProvider>
					{isApp ? (
						// Layout is on the app component itself so it can be context aware
						<Component {...pageProps} />
					) : (
						<Layout header={<AppHeader />}>
							<Component {...pageProps} />
						</Layout>
					)}
				</NotificationsProvider>
			</ThemeProvider>
		</AuthProvider>
	)
}

export default MyApp
