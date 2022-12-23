import { ListData } from 'components/List/List'
import { ListId } from 'lib/ListService'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ListsMenu from './ListsMenu'
import { useCreateLists, useDeleteList, useRenameList } from './useLists'

export interface ListProps {
	activeListId: ListId | null
	setActiveListId: Dispatch<SetStateAction<ListId | null>>
	isLoading: boolean
	lists?: ListData[]
}

const Lists: React.FC<ListProps> = ({
	activeListId,
	setActiveListId,
	isLoading,
	lists,
}) => {
	const create = useCreateLists()
	const remove = useDeleteList()
	const rename = useRenameList()

	// TODO: This will go away when we fetch the list server-side
	useEffect(() => {
		if (!lists?.length) return

		if (!lists.some(l => l.id === activeListId)) {
			setActiveListId(lists[0].id)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lists?.length])

	const mappedLists = lists?.map(l => ({ name: l.name, id: l.id }))

	const setActive = (id: ListId) => {
		console.log('setting active list', id)
		return Promise.resolve(setActiveListId(id))
	}

	return (
		<ListsMenu
			lists={mappedLists ?? []}
			listActions={{
				setActive,
				create,
				remove,
				rename,
			}}
			activeListId={activeListId}
			loading={isLoading}
		/>
	)
}

export default Lists
