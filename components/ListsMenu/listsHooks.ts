import { showNotification } from '@mantine/notifications'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import listKeys from 'lib/listKeys'
import ListService, { List, ListId } from 'lib/ListService'
import { checkForError } from 'lib/utils'
import { useMutation, useQuery, useQueryClient } from 'react-query'

function useLists() {
	const supabaseClient = useSupabaseClient()
	return new ListService(supabaseClient)
}

export function useFetchLists() {
	const { getLists } = useLists()

	return useQuery(listKeys.all, getLists, {
		onError: e => {
			handleError('Unable to find lists.')
			console.error(e)
		},
	})
}

export function useCreateList() {
	const { createList } = useLists()
	const queryClient = useQueryClient()
	const user = useUser()

	return useMutation(
		({ name }: { name: string }) => createList(name, user!.id),
		{
			onSuccess: ({ error }) => {
				checkForError(error)
				queryClient.invalidateQueries(listKeys.all)
			},
			onError: e => {
				handleError('Unable to create list.')
				console.error(e)
			},
		},
	)
}

export type RenameListArgs = { name: string; id: ListId }

export function useRenameList() {
	const { renameList } = useLists()
	const queryClient = useQueryClient()

	return useMutation(({ name, id }: RenameListArgs) => renameList(id, name), {
		onMutate: async item => {
			await queryClient.cancelQueries({ queryKey: listKeys.all })

			const previousItems = queryClient.getQueryData<List[]>(listKeys.all)

			queryClient.setQueryData(listKeys.all, (oldLists: List[] | undefined) => {
				if (!oldLists) return []

				const newLists = [...oldLists]
				const changed = oldLists.findIndex(l => l.id === item.id)
				newLists[changed].name = item.name

				return newLists
			})

			return { previousItems }
		},
		onSuccess: ({ error }) => {
			checkForError(error)
			return queryClient.invalidateQueries(listKeys.all)
		},
		onSettled: () => {
			return queryClient.invalidateQueries({ queryKey: listKeys.all })
		},
		onError: e => {
			handleError('Unable to rename list.')
			console.error(e)
		},
	})
}

export const useDeleteList = () => {
	const { deleteList } = useLists()
	const queryClient = useQueryClient()

	return useMutation(({ id }: { id: ListId }) => deleteList(id), {
		onSuccess: ({ error }) => {
			checkForError(error)
			return queryClient.invalidateQueries(listKeys.all)
		},
		onError: e => {
			handleError('Unable to delete list.')
			console.error(e)
		},
	})
}

function handleError(message: string) {
	showNotification({
		color: 'red',
		message,
	})
}
