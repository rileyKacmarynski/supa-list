import { showNotification } from '@mantine/notifications'
import { listKeys } from 'components/ListsMenu/listsHooks'
import { SupabaseClient, useSupabaseClient } from 'lib/supabaseClient'
import { useMutation, useQueryClient } from 'react-query'

export type DeleteItemArgs = { itemId: string }

export default function useDeleteItem() {
	const supabaseClient = useSupabaseClient()
	const queryClient = useQueryClient()

	return useMutation(
		({ itemId }: DeleteItemArgs) => deleteItem(itemId, supabaseClient),
		{
			onError: e => {
				showNotification({
					color: 'red',
					message: 'Unable to delete item.',
				})
				console.error(e)
			},
			onSuccess: data => {
				return queryClient.invalidateQueries(listKeys.detail(data.list_id))
			},
		},
	)
}

async function deleteItem(itemId: string, supabaseClient: SupabaseClient) {
	const { data, error } = await supabaseClient
		.from('list_items')
		.delete()
		.eq('id', itemId)
		.select('*')

	if (error) {
		throw new Error(error.message)
	}

	return data[0]
}
