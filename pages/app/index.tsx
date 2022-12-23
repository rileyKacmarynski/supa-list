import { ScrollArea } from '@mantine/core'
import AppHeader from 'components/AppHeader'
import Layout from 'ui/Layout'
import Lists from 'components/Lists'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@supabase/auth-helpers-react'
import { ListId } from 'lib/ListService'
import { GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from 'types/supabase'
import List, { ListItem } from 'components/List'
import { useFetchLists } from 'components/Lists/useLists'
import { PostgrestError } from '@supabase/supabase-js'

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

	const lists = mapLists(data)
	const activeList = lists?.find(l => l.id === activeListId)

	useEffect(() => {
		if (!user) {
			router.push('login')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	console.log('mapped lists', lists)

	return (
		<Layout
			header={<AppHeader />}
			navbar={
				<Lists
					isLoading={isLoading}
					lists={lists}
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

// this type is really gross to work with
// hide it here
function mapLists(
	data:
		| {
				lists:
					| ({
							id: string
							name: string
							created_at: string
							last_modified: string
							created_by: string
							contributors: string[]
					  } & {
							list_items:
								| {
										id: string
										list_id: string
										created_by: string
										text: string
										order: number
										created_at: string
								  }
								| {
										id: string
										list_id: string
										created_by: string
										text: string
										order: number
										created_at: string
								  }[]
								| null
					  })[]
					| null
				error: PostgrestError | null
				data?: undefined
		  }
		| { data: null; error: string; lists?: undefined }
		| undefined,
) {
	return data?.lists?.map(l => ({
		id: l.id,
		name: l.name,
		contributors: l.contributors,
		createdAt: new Date(l.created_at),
		lastModified: new Date(l.last_modified),
		createdBy: l.created_by,
		items: (l.list_items as any[]).map(l => ({
			id: l.id,
			text: l.text,
			createdAt: new Date(l.created_at),
			createdBy: l.created_by,
			order: l.order,
		})) as ListItem[],
	}))
}

export default App
