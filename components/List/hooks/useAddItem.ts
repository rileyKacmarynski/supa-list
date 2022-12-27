import { showNotification } from '@mantine/notifications'
import { useUser } from '@supabase/auth-helpers-react'
import { listKeys } from 'components/ListsMenu/listsHooks'
import { ListId } from 'lib/ListService'
import { SupabaseClient, useSupabaseClient } from 'lib/supabaseClient'
import { useMutation, useQueryClient } from 'react-query'

export type AddItemArgs = {
	text: string
}

export default function useAddItem(listId: string) {
	const supabaseClient = useSupabaseClient()
	const user = useUser()
	const queryClient = useQueryClient()

	if (!user) {
		throw new Error('Must be logged in.')
	}

	return useMutation(
		({ text }: AddItemArgs) =>
			addItem({ text, userId: user.id, listId }, supabaseClient),
		{
			onError: e => {
				showNotification({
					color: 'red',
					message: 'Unable to add item.',
				})
				console.error(e)
			},
			onSuccess: () => {
				console.log(queryClient.getQueryCache())
				return queryClient.invalidateQueries(listKeys.detail(listId))
			},
		},
	)
}

async function addItem(
	{ text, userId, listId }: { text: string; userId: string; listId: ListId },
	supabaseClient: SupabaseClient,
) {
	const { count, error: queryError } = await supabaseClient
		.from('list_items')
		.select('*', { count: 'exact', head: true })
		.eq('list_id', listId)

	if (queryError) throw new Error(queryError.message)
	if (count === null)
		throw new Error('unable to fetch number of existing items.')

	const { error } = await supabaseClient.from('list_items').insert({
		list_id: listId,
		text: text,
		created_by: userId,
		order: count + 1,
	})

	if (error) {
		throw new Error(error.message)
	}
}
