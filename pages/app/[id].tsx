import { GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from 'types/supabase'
import List from 'components/List'
import { useUser } from '@supabase/auth-helpers-react'
import AppHeader from 'components/AppHeader'
import ListsMenu from 'components/ListsMenu'
import { ListDetail } from 'lib/ListService'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Layout from 'ui/Layout'
import useFetchList, { getList } from 'components/List/hooks/useFetchList'
import { MyAppProps } from 'pages/_app'
import { dehydrate, QueryClient } from 'react-query'
import listKeys from 'lib/listKeys'

type QueryProps = {
	id: string
}

type ComponentProps = {
	id: string
}

export const getServerSideProps: GetServerSideProps<
	MyAppProps & ComponentProps,
	QueryProps
> = async ctx => {
	const supabase = createServerSupabaseClient<Database>(ctx)
	const {
		data: { session },
	} = await supabase.auth.getSession()

	const redirectTo = (pathName: string) => ({
		redirect: {
			destination: pathName,
			permanent: false,
		},
	})

	if (!session) return redirectTo('/login')

	if (!ctx.params?.id) return { notFound: true }

	// const list = await getList(ctx.params.id, supabase)
	// if (!list) return redirectTo('/404')

	const { id } = ctx.params
	const queryClient = new QueryClient()
	await queryClient.prefetchQuery(listKeys.detail(id), () =>
		getList(id, supabase),
	)

	return {
		props: {
			initialSession: session,
			user: session.user,
			id,
			dehydratedState: dehydrate(queryClient),
		},
	}
}

// in get static props we'll pass in the active list id and full list list
const ListPage: React.FC<ComponentProps> = ({ id }) => {
	const user = useUser()
	const router = useRouter()
	const { data } = useFetchList(id)

	if (!data) {
		console.log('we dont have data yet')
	}

	useEffect(() => {
		if (!user) {
			router.push('login')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	return (
		<Layout header={<AppHeader />} navbar={<ListsMenu activeListId={id} />}>
			<List list={data!} />
		</Layout>
	)
}

export default ListPage
