'use client'
import { NotificationsProvider } from '@mantine/notifications'
import { client } from 'lib/auth/AuthClient'
import AuthProvider from 'lib/auth/AuthContextProvider'
import '../styles/globals.css'
import { ThemeProvider } from '../ui/Theme'

if (process.env.NEXT_PUBLIC_API_MOCKING == 'true') {
	import('../mocks').then(mod => mod.initMocks())
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html>
			<head></head>
			<body>
				<AuthProvider client={client}>
					<ThemeProvider>
						<NotificationsProvider>{children}</NotificationsProvider>
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	)
}
