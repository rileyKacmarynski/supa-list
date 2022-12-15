import { ScrollArea } from '@mantine/core'
import AppHeader from 'components/AppHeader'
import Layout from 'ui/Layout'
import Lists from 'components/Lists'
import { useEffect } from 'react'
import { useAuth } from 'lib/auth/AuthContextProvider'
import { useRouter } from 'next/navigation'

const App = () => {
	const { user } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!user) {
			router.push('login')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	return (
		<Layout header={<AppHeader />} navbar={<Lists />}>
			<ScrollArea offsetScrollbars sx={{ width: '100vw' }}>
				<div>
					<p>This is the app page</p>
				</div>
			</ScrollArea>
		</Layout>
	)
}

export default App
