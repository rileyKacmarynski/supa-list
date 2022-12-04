import { ScrollArea } from '@mantine/core'
import AppHeader from 'components/AppHeader'
import Layout from 'ui/Layout'
import supabaseClient from 'lib/supabaseClient'
import { useAuth } from 'lib/auth/AuthContextProvider'
import { authClient } from 'lib/auth/AuthClient'
import { useEffect, useState } from 'react'
import ListsMenu, { List, ListActions, ListId } from 'components/Lists'
import { PostgrestError } from '@supabase/supabase-js'
import { showNotification } from '@mantine/notifications'
import { v4 as uuidv4 } from 'uuid'

function getErrorMessage(e: unknown) {
	return e instanceof Error ? e.message : 'An error occured.'
}

const listQuery = `
	*,
	user_lists (
		user_id,
		role
	)
`

export interface ApiResponse<T> {
	data?: T
	error?: string | PostgrestError | null
}

async function getLists(): Promise<ApiResponse<any>> {
	try {
		const { data, error } = await supabaseClient
			.from('lists')
			.select(listQuery)
			.order('last_modified', { ascending: false })

		return { data, error }
	} catch (e) {
		return { data: null, error: getErrorMessage(e) }
	}
}

async function deleteList(id: string) {
	try {
		const { error: ulError } = await supabaseClient
			.from('user_lists')
			.delete()
			.eq('list_id', id)
		if (ulError) {
			return { error: ulError }
		}

		const { error } = await supabaseClient.from('lists').delete().eq('id', id)

		return { error }
	} catch (e) {
		return { error: getErrorMessage(e) }
	}
}

async function renameList(id: string, name: string) {
	try {
		const { data, error } = await supabaseClient
			.from('lists')
			.update({ name, last_modified: new Date() })
			.eq('id', id)
			.select()

		return { list: data, error }
	} catch (e) {
		return { error: getErrorMessage(e) }
	}
}

async function createList(name: string) {
	try {
		// this should be in a database function, but
		// for sake of time I'll do it like this for no
		const user = await authClient.getUser()

		// insert list
		const id = uuidv4()
		// due to rls policy I can't select
		// this row until inserting the user_list
		const { error } = await supabaseClient.from('lists').insert({ name, id })

		console.log(error)

		if (error) throw new Error(error.message)

		// insert user_list
		const { error: ulError } = await supabaseClient
			.from('user_lists')
			.insert({ user_id: user?.id, list_id: id, role: 'author' })

		if (ulError) throw new Error(ulError.message)

		const { error: selectError, data: list } = await supabaseClient
			.from('lists')
			.select(listQuery)
			.eq('id', id)

		return { error: selectError, data: list }
	} catch (e) {
		return { error: getErrorMessage(e) }
	}
}

const App = () => {
	const { user } = useAuth()
	const [lists, setLists] = useState<List[]>([])
	const [loadingLists, setLoadingLists] = useState(true)
	const [activeListId, setActiveListId] = useState<string | null>(null)

	useEffect(() => {
		async function get() {
			if (!user) return []

			try {
				setLoadingLists(true)

				const { data: lists, error } = await getLists()

				if (lists?.length) {
					setLists(
						lists?.map(l => ({
							name: l.name,
							id: l.id,
						})),
					)

					if (!activeListId) {
						setActiveListId(lists[0].id)
					}
				}

				console.log('lists', lists)
				console.log('error', error)
			} catch (ex) {
				console.log(ex)
			}

			setLoadingLists(false)
		}
		get()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	const handleListChanges: (
		fn: () => Promise<ApiResponse<any>>,
		message: string,
	) => Promise<void> = async (fn, message) => {
		const { error } = await fn()

		if (error) {
			console.error(error)

			showNotification({
				message,
				color: 'red',
			})
		}

		const { data } = await getLists()

		console.log('lists changed', data)

		if (data.length) {
			setLists(
				data?.map(l => ({
					name: l.name,
					id: l.id,
				})),
			)
		}
	}

	const listActions: ListActions = {
		deleteItem: (id: ListId) =>
			handleListChanges(() => deleteList(id), 'Error deleting list.'),
		renameItem: (id: ListId, name: string) =>
			handleListChanges(() => renameList(id, name), 'Error renaming list.'),
		// handle fetching list items later
		setActive: (id: ListId) => Promise.resolve(setActiveListId(id)),
		createList: (name: string) =>
			handleListChanges(() => createList(name), 'Error creating list.'),
	}

	return (
		<Layout
			header={<AppHeader />}
			navbar={
				<ListsMenu
					lists={lists}
					listActions={listActions}
					activeListId={activeListId}
					loading={loadingLists}
				/>
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
