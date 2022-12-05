import { useAuth } from 'lib/auth/AuthContextProvider'
import { useEffect, useState } from 'react'
import ListsMenu, { List, ListActions, ListId } from './ListsMenu'
import { showNotification } from '@mantine/notifications'
import { createList, deleteList, getLists, renameList } from 'lib/listService'
import { ApiResponse } from 'lib/utils'

const Lists = () => {
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
						lists?.map((l: any) => ({
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

		// TODO: handle successful changes

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
				data?.map((l: any) => ({
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
		<ListsMenu
			lists={lists}
			listActions={listActions}
			activeListId={activeListId}
			loading={loadingLists}
		/>
	)
}

export default Lists
