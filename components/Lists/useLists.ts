import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { checkForError } from 'lib/utils'
import { SupabaseError, useSupabaseClient } from 'lib/supabaseClient'
import { showNotification } from '@mantine/notifications'
import { useListService } from 'lib/ListService'
import { useUser } from '@supabase/auth-helpers-react'

export const useLists = () => {
	const LIST_KEY = 'lists'
	const supabaseClient = useSupabaseClient()
	const listsService = useListService(supabaseClient)
	// not sure if I'm a fan of this
	// will leave for now until it causes problems
	const user = useUser()

	const { data, isLoading } = useSWR(LIST_KEY, listsService.getLists, {
		onSuccess: ({ error }) => checkForError(error),
		onError: e => {
			showNotification({
				color: 'red',
				message: 'Unable to find lists.',
			})

			console.error(e)
		},
	})

	const { trigger: create } = useSWRMutation<
		Awaited<ReturnType<typeof listsService.createList>>,
		SupabaseError,
		string,
		[name: string]
	>(LIST_KEY, (_, { arg: [name] }) => listsService.createList(name, user!.id), {
		onSuccess: ({ error }) => checkForError(error),
		onError: e => {
			showNotification({
				color: 'red',
				message: 'Unable to create list.',
			})

			console.error(e)
		},
	})

	const { trigger: rename } = useSWRMutation(
		LIST_KEY,
		(_, { arg: [id, name] }) => listsService.renameList(id, name),
		{
			onSuccess: ({ error }) => checkForError(error),
			onError: e => {
				showNotification({
					color: 'red',
					message: 'Unable to rename list.',
				})

				console.error(e)
			},
		},
	)

	const { trigger: remove } = useSWRMutation(
		LIST_KEY,
		(_, { arg: [id] }) => listsService.deleteList(id),
		{
			onSuccess: ({ error }) => checkForError(error),
			onError: e => {
				showNotification({
					color: 'red',
					message: 'Unable to delete list.',
				})

				console.error(e)
			},
		},
	)

	return {
		data,
		isLoading,
		create,
		remove,
		rename,
	}
}
