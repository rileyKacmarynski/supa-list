import { ScrollArea } from '@mantine/core'
import AppHeader from 'components/AppHeader'
import Layout from 'ui/Layout'
import ListsMenu from 'components/ListsMenu'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@supabase/auth-helpers-react'
import { ListId } from 'lib/ListService'
import { GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from 'types/supabase'
import List from 'components/List'
import { useFetchLists } from 'components/ListsMenu/useLists'

// this will give us the initial session in the _app.tsx component I think
export const getServerSideProps: GetServerSideProps = async ctx => {
	const supabase = createServerSupabaseClient<Database>(ctx)
	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (!session)
		return {
			redirect: {
				destination: '/login',
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

// in get static props we'll pass in the active list id and full list list
const App = () => {
	// this will come from the query string eventually
	const [activeListId, setActiveListId] = useState<ListId | null>(null)
	const { data, isLoading } = useFetchLists()
	const user = useUser()
	const router = useRouter()

	const activeList = data?.lists?.find(l => l.id === activeListId)

	// we might not need this
	useEffect(() => {
		if (!user) {
			router.push('login')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	return (
		<Layout
			header={<AppHeader />}
			navbar={
				<ListsMenu
					activeListId={activeListId}
					setActiveListId={setActiveListId}
				/>
			}
		>
			<ScrollArea
				offsetScrollbars
				sx={{ width: '100vw', position: 'relative' }}
			>
				<List list={activeList} isLoading={isLoading} />
			</ScrollArea>
		</Layout>
	)
}

export default App
