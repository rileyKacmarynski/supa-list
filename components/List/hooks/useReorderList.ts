import { showNotification } from '@mantine/notifications'
import listKeys from 'lib/listKeys'
import { ListDetail } from 'lib/ListService'
import { SupabaseClient, useSupabaseClient } from 'lib/supabaseClient'
import { useMutation, useQueryClient } from 'react-query'

export type ReorderListItem = {
	id: string
	order: number
}

export type ReorderListArgs = {
	items: ReorderListItem[]
}

export default function useReorderList(listId: string) {
	const supabaseClient = useSupabaseClient()
	const queryClient = useQueryClient()
	const queryKey = listKeys.detail(listId)

	return useMutation(
		({ items }: ReorderListArgs) =>
			reorderItem({ items, listId }, supabaseClient),
		{
			onError: e => {
				showNotification({
					color: 'red',
					message: 'Unable to add item.',
				})
				console.error(e)
			},
			onMutate: async ({ items }) => {
				await queryClient.cancelQueries({ queryKey })

				const previousList = queryClient.getQueryData<ListDetail>(queryKey)

				queryClient.setQueryData(
					queryKey,
					(oldList: ListDetail | undefined) => {
						if (!oldList)
							throw new Error('How are we reordering a list that doesnt exist?')

						return {
							...oldList,
							items: reorderListItems(items, oldList.items),
						}
					},
				)

				return { previousList }
			},
			onSettled: () => {
				return queryClient.invalidateQueries({ queryKey })
			},
		},
	)
}

async function reorderItem(
	{ items, listId }: { items: ReorderListItem[]; listId: string },
	supabaseClient: SupabaseClient,
) {
	console.log('drag ended', items)

	const { data, error: queryError } = await supabaseClient
		.from('list_items')
		.select('*')
		.order('order', { ascending: true })
		.eq('list_id', listId)

	if (queryError) throw new Error(queryError.message)

	const newData = reorderListItems(items, data)

	const { error } = await supabaseClient.from('list_items').upsert(newData)

	if (error) {
		throw new Error(error.message)
	}
}

function reorderListItems<T extends { id: string }>(
	newItems: ReorderListItem[],
	existingItems: T[],
) {
	return newItems.map((item, index) => {
		const savedItem = existingItems.find(d => d.id === item.id)
		if (!savedItem) throw new Error('Items in db do not match reordered items')

		return {
			...savedItem,
			order: index + 1,
		}
	})
}
