import { showNotification } from '@mantine/notifications'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import listKeys from 'lib/listKeys'
import { ListDetail } from 'lib/ListService'
import { SupabaseClient } from 'lib/supabaseClient'
import { useMutation, useQueryClient } from 'react-query'

export type ToggleCompleteArgs = {
	itemId: string
	completed: boolean
}

export default function useToggleComplete(listId: string) {
	const supabaseClient = useSupabaseClient()
	const queryClient = useQueryClient()

	return useMutation(
		({ completed, itemId }: ToggleCompleteArgs) =>
			markComplete({ completed, itemId }, supabaseClient),
		{
			onError: e => {
				showNotification({
					color: 'red',
					message: 'Unable to mark item complete.',
				})
				console.error(e)
			},
			onMutate: async item => {
				const queryKey = listKeys.detail(listId)

				await queryClient.cancelQueries({ queryKey })

				const previousList = queryClient.getQueryData<ListDetail>(queryKey)

				queryClient.setQueryData(
					queryKey,
					(oldList: ListDetail | undefined) => {
						if (!oldList)
							throw new Error('Unable to mark item complete. List doesnt exist')

						const oldItem = oldList?.items.find(i => i.id === item.itemId)
						if (!oldItem) {
							return oldList
						}

						return {
							...oldList,
							items: oldList!.items.map(i =>
								item.itemId === i.id
									? {
											...i,
											completed: !i.completed,
									  }
									: i,
							),
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

async function markComplete(
	{ itemId, completed }: { itemId: string; completed: boolean },
	supabaseClient: SupabaseClient,
) {
	const { data, error } = await supabaseClient
		.from('list_items')
		.update({ completed })
		.eq('id', itemId)
		.select('*')

	if (error) {
		throw new Error(error.message)
	}

	return data[0]
}
