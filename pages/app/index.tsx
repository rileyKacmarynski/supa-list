import { ScrollArea } from '@mantine/core'
import AppHeader from 'components/AppHeader'
import Layout from 'ui/Layout'
import Lists from 'components/Lists'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { showNotification } from '@mantine/notifications'
import { checkForError } from 'lib/utils'
import { User, useUser } from '@supabase/auth-helpers-react'
import { ListId, useListService } from 'lib/ListService'
import { useSupabaseClient } from 'lib/supabaseClient'
import { GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export const getServerSideProps: GetServerSideProps = async ctx => {
	const supabase = createServerSupabaseClient(ctx)
	// Check if we have a session
	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (!session)
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}

	return {
		props: {
			initialSession: session,
			user: session.user,
		},
	}
}
const App = ({ user }: { user: User }) => {
	// this will come from the query string eventually
	const [activeListId, setActiveListId] = useState<ListId | null>(null)
	console.log('user in client', user)

	const supabaseClient = useSupabaseClient()
	const listService = useListService(supabaseClient)

	const router = useRouter()

	useEffect(() => {
		if (!user) {
			router.push('login')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	const LIST_KEY = 'list'
	const { data, isLoading } = useSWR(
		activeListId !== null ? `${LIST_KEY}/${activeListId}` : null,
		args => listService.getList(args.split('/')[1]),
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
