import { showNotification } from '@mantine/notifications'
import { SupabaseClient, useSupabaseClient } from 'lib/supabaseClient'
import { useMutation } from 'react-query'

export type DeleteItemArgs = { itemId: string }

export default function useDeleteItem() {
	const supabaseClient = useSupabaseClient()

	return useMutation(
		({ itemId }: DeleteItemArgs) => deleteItem(itemId, supabaseClient),
		{
			onError: e => {
				showNotification({
					color: 'red',
					message: 'Unable to mark item complete.',
				})
				console.error(e)
			},
		},
	)
}

async function deleteItem(itemId: string, supabaseClient: SupabaseClient) {
	const { error } = await supabaseClient
		.from('list_items')
		.delete()
		.eq('id', itemId)

	if (error) {
		throw new Error(error.message)
	}
}
