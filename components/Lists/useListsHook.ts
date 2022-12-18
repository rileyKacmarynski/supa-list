import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { checkForError } from 'lib/utils'
import { SupabaseError } from 'lib/supabaseClient'
import { showNotification } from '@mantine/notifications'
import {
	getLists,
	CreateListResult,
	CreateListArgs,
	createList,
	RenameListResult,
	RenameListArgs,
	renameList,
	DeleteListResult,
	DeleteListArgs,
	deleteList,
} from 'lib/listService'

export const useLists = () => {
	const LIST_KEY = 'lists'

	const { data, isLoading } = useSWR(LIST_KEY, getLists, {
		onSuccess: ({ error }) => checkForError(error),
		onError: () => {
			showNotification({
				color: 'red',
				message: 'Unable to find lists.',
			})
		},
	})

	const { trigger: create } = useSWRMutation<
		CreateListResult,
		SupabaseError,
		string,
		CreateListArgs
	>(LIST_KEY, (_, { arg: [name] }) => createList(name), {
		onSuccess: ({ error }) => checkForError(error),
		onError: () => {
			showNotification({
				color: 'red',
				message: 'Unable to create list.',
			})
		},
	})

	const { trigger: rename } = useSWRMutation<
		RenameListResult,
		SupabaseError,
		string,
		RenameListArgs
	>(LIST_KEY, (_, { arg: [id, name] }) => renameList(id, name), {
		onSuccess: ({ error }) => checkForError(error),
		onError: () => {
			showNotification({
				color: 'red',
				message: 'Unable to rename list.',
			})
		},
	})

	const { trigger: remove } = useSWRMutation<
		DeleteListResult,
		SupabaseError,
		string,
		DeleteListArgs
	>(LIST_KEY, (_, { arg: [id] }) => deleteList(id), {
		onSuccess: ({ error }) => checkForError(error),
		onError: () => {
			showNotification({
				color: 'red',
				message: 'Unable to delete list.',
			})
		},
	})

	return {
		data,
		isLoading,
		create,
		remove,
		rename,
	}
}
