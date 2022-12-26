import { NotificationsProvider } from '@mantine/notifications'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react'
import AppHeader from 'components/AppHeader'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import { Database } from 'types/supabase'
import '../styles/globals.css'
import Layout from '../ui/Layout'
import { ThemeProvider } from '../ui/Theme'
import { QueryClient, QueryClientProvider } from 'react-query'

if (process.env.NEXT_PUBLIC_API_MOCKING == 'true') {
	import('../mocks')
}

const queryClient = new QueryClient()

function App({
	Component,
	pageProps,
	...appProps
}: AppProps<{ initialSession: Session }>) {
	// we only need one client for each render
	const [supabaseClient] = useState(() =>
		createBrowserSupabaseClient<Database>(),
	)

	const isApp = ['/app'].includes(appProps.router.pathname)

	return (
		<SessionContextProvider
			supabaseClient={supabaseClient}
			initialSession={pageProps.initialSession}
		>
			<ThemeProvider>
				<NotificationsProvider>
					<QueryClientProvider client={queryClient}>
						{isApp ? (
							// Layout is on the app component itself so it can be context aware
							<Component {...pageProps} />
						) : (
							<Layout header={<AppHeader />}>
								<Component {...pageProps} />
							</Layout>
						)}
					</QueryClientProvider>
				</NotificationsProvider>
			</ThemeProvider>
		</SessionContextProvider>
	)
}

export default App
