import useSWR, { SWRConfiguration } from 'swr'
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation'
import { checkForError } from 'lib/utils'
import { SupabaseError } from 'lib/supabaseClient'
import { showNotification } from '@mantine/notifications'
import ListService, {
	CreateListFn,
	DeleteListFn,
	GetListsFn,
	ListId,
	RenameListFn,
} from 'lib/ListService'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

const LIST_KEY = 'lists'

function useLists() {
	const supabaseClient = useSupabaseClient()
	return new ListService(supabaseClient)
}

export type FetchListsConfiguration = TypedFetcherConfiguration<GetListsFn>

export const useFetchLists = (options?: FetchListsConfiguration) => {
	const { getLists } = useLists()

	return useSWR<AwaitedReturn<GetListsFn>, SupabaseError, string>(
		LIST_KEY,
		getLists,
		{
			onSuccess: ({ error }) => checkForError(error),
			onError: e => {
				handleError('Unable to find lists.')
				console.error(e)
			},
			...options,
		},
	)
}

type CreateListArgs = [name: string]
export type CreateListConfiguration = TypedMutationConfiguration<
	CreateListFn,
	CreateListArgs
>

export const useCreateLists = (options?: CreateListConfiguration) => {
	const { createList } = useLists()
	// might be better to pass userId in
	const user = useUser()

	const { trigger } = useSWRMutation<
		AwaitedReturn<CreateListFn>,
		SupabaseError,
		string,
		CreateListArgs
	>(LIST_KEY, (_, { arg: [name] }) => createList(name, user!.id), {
		onSuccess: ({ error }) => checkForError(error),
		onError: e => {
			handleError('Unable to create list.')
			console.error(e)
		},
		...options,
	})

	return (name: string) => trigger([name])
}

type RenameArgs = [id: ListId, name: string]
export type RenameListConfiguration = TypedMutationConfiguration<
	RenameListFn,
	RenameArgs
>

export const useRenameList = (options?: RenameListConfiguration) => {
	const { renameList } = useLists()

	const { trigger } = useSWRMutation<
		AwaitedReturn<RenameListFn>,
		SupabaseError,
		string,
		RenameArgs
	>(LIST_KEY, (_, { arg: [id, name] }) => renameList(id, name), {
		onSuccess: ({ error }) => checkForError(error),
		onError: e => {
			handleError('Unable to rename list.')
			console.error(e)
		},
		...options,
	})

	return (id: ListId, name: string) => trigger([id, name])
}

type RemoveListArgs = [id: string]
export type RemoveListConfiguration = TypedMutationConfiguration<
	DeleteListFn,
	RemoveListArgs
>

export const useDeleteList = (options?: RemoveListConfiguration) => {
	const { deleteList } = useLists()

	const { trigger } = useSWRMutation<
		AwaitedReturn<DeleteListFn>,
		SupabaseError,
		string | null,
		RemoveListArgs
	>(
		// how can we pass this ID in here?
		// might want to just use this at the lowest possible spot
		// id ? `${LIST_KEY}/${id}` : null,
		LIST_KEY,
		(_, { arg: [id] }) => deleteList(id),
		{
			onSuccess: ({ error }) => checkForError(error),
			onError: e => {
				handleError('Unable to delete list.')
				console.error(e)
			},
			...options,
		},
	)

	return (id: ListId) => trigger([id])
}

type AwaitedReturn<T extends (...args: any) => any> = Awaited<ReturnType<T>>

type TypedFetcherConfiguration<TFetcherFn extends (...args: any) => any> =
	SWRConfiguration<AwaitedReturn<TFetcherFn>, SupabaseError>

type TypedMutationConfiguration<
	TMutateFn extends (...args: any) => any,
	TArgs,
> = SWRMutationConfiguration<
	AwaitedReturn<TMutateFn>,
	SupabaseError,
	TArgs,
	string
>

function handleError(message: string) {
	showNotification({
		color: 'red',
		message,
	})
}
