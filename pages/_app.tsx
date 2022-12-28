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
import {
	DehydratedState,
	Hydrate,
	QueryClient,
	QueryClientProvider,
} from 'react-query'

if (process.env.NEXT_PUBLIC_API_MOCKING == 'true') {
	import('../mocks')
}

export type MyAppProps = {
	initialSession: Session
	user: Session['user']
	dehydratedState?: DehydratedState
}

function App({ Component, pageProps, ...appProps }: AppProps<MyAppProps>) {
	// we only need one client for each render
	const [supabaseClient] = useState(() =>
		createBrowserSupabaseClient<Database>(),
	)
	const [queryClient] = useState(() => new QueryClient())

	const isApp = appProps.router.pathname.includes('/app')

	return (
		<SessionContextProvider
			supabaseClient={supabaseClient}
			initialSession={pageProps.initialSession}
		>
			<ThemeProvider>
				<NotificationsProvider>
					<QueryClientProvider client={queryClient}>
						<Hydrate state={pageProps.dehydratedState}>
							{isApp ? (
								// Layout is on the app component itself so it can be context aware
								<Component {...pageProps} />
							) : (
								<Layout header={<AppHeader />}>
									<Component {...pageProps} />
								</Layout>
							)}
						</Hydrate>
					</QueryClientProvider>
				</NotificationsProvider>
			</ThemeProvider>
		</SessionContextProvider>
	)
}

export default App
