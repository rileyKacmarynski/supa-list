import { showNotification } from '@mantine/notifications'
import listKeys from 'lib/listKeys'
import { ListDetail } from 'lib/ListService'
import { SupabaseClient, useSupabaseClient } from 'lib/supabaseClient'
import { useMutation, useQueryClient } from 'react-query'

export type DeleteItemArgs = { itemId: string }

export default function useDeleteItem(listId: string) {
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
			onMutate: async ({ itemId }) => {
				const queryKey = listKeys.detail(listId)

				await queryClient.cancelQueries({ queryKey })

				const previousList = queryClient.getQueryData<ListDetail>(queryKey)

				queryClient.setQueryData(
					queryKey,
					(oldList: ListDetail | undefined) => {
						if (!oldList)
							throw new Error('Unable to mark item complete. List doesnt exist')

						const oldItem = oldList?.items.find(i => i.id === itemId)
						if (!oldItem) {
							return oldList
						}

						return {
							...oldList,
							items: oldList.items.filter(i => i.id !== itemId),
						}
					},
				)

				return { previousList }
			},
			onSettled: () => {
				return queryClient.invalidateQueries(listKeys.detail(listId))
			},
			onSuccess: () => {
				return queryClient.invalidateQueries(listKeys.detail(listId))
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
