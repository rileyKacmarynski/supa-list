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
import { useFetchLists } from 'components/ListsMenu/listsHooks'
import { ListEmptyState } from 'components/List/ListEmptyState'

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

	// do work to see if user has lists and pick one to be active

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
	const user = useUser()
	const router = useRouter()

	useEffect(() => {
		if (!user) {
			router.push('login')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	return (
		<Layout
			header={<AppHeader />}
			navbar={<ListsMenu activeListId={activeListId} />}
		>
			<ListEmptyState />
		</Layout>
	)
}

export default App
