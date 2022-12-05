import { ScrollArea } from '@mantine/core'
import AppHeader from 'components/AppHeader'
import Layout from 'ui/Layout'
import Lists from 'components/Lists'

const App = () => {
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
