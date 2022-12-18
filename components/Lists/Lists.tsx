import { ListId } from 'lib/listService'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ListsMenu, { ListActions } from './ListsMenu'
import { useLists } from './useListsHook'

export interface ListProps {
	activeListId: ListId | null
	setActiveListId: Dispatch<SetStateAction<ListId | null>>
}

const Lists: React.FC<ListProps> = ({ activeListId, setActiveListId }) => {
	const { data, isLoading, create, rename, remove } = useLists()

	useEffect(() => {
		if (!data?.lists?.length) return

		if (!data.lists.some(l => l.id === activeListId)) {
			setActiveListId(data.lists[0].id)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.lists?.length])

	const mappedLists = data?.lists?.map(l => ({ name: l.name, id: l.id }))

	const listActions: ListActions = {
		deleteItem: (id: ListId) => remove([id]),
		renameItem: (id: ListId, name: string) => rename([id, name]),
		// handle fetching list items later
		setActive: (id: ListId) => {
			console.log('setting active list', id)
			return Promise.resolve(setActiveListId(id))
		},
		createList: async (name: string) => create([name]),
	}

	return (
		<ListsMenu
			lists={mappedLists ?? []}
			listActions={listActions}
			activeListId={activeListId}
			loading={isLoading}
		/>
	)
}

export default Lists
