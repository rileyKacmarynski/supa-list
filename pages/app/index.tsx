import { ScrollArea } from '@mantine/core'
import AppHeader from 'components/AppHeader'
import Layout from 'ui/Layout'
import Lists from 'components/Lists'
import { useEffect, useState } from 'react'
import { useAuth } from 'lib/auth/AuthContextProvider'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { getList, GetListResult, ListId } from 'lib/listService'
import { showNotification } from '@mantine/notifications'
import { checkForError } from 'lib/utils'

const App = () => {
	// this will come from the query string eventually
	const [activeListId, setActiveListId] = useState<ListId | null>(null)
	const { user } = useAuth()
	const router = useRouter()

	useEffect(() => {
		console.log('user', user)
		if (!user) {
			router.push('login')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	const LIST_KEY = 'list'
	const { data, isLoading } = useSWR(
		`${LIST_KEY}/${activeListId}`,
		args => getList(args.split('/')[1]),
		{
			onSuccess: ({ error, list }) => {
				console.log('fetched lists', list)
				return checkForError(error)
			},
			onError: () => {
				showNotification({
					message: 'unable to find list',
					color: 'red',
				})
			},
		},
	)

	return (
		<Layout
			header={<AppHeader />}
			navbar={
				<Lists activeListId={activeListId} setActiveListId={setActiveListId} />
			}
		>
			<ScrollArea offsetScrollbars sx={{ width: '100vw' }}>
				<div>
					<p>This is the app page</p>
				</div>
			</ScrollArea>
		</Layout>
	)
}

export default App
