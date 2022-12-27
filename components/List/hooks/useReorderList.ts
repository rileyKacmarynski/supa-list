import { showNotification } from '@mantine/notifications'
import { useUser } from '@supabase/auth-helpers-react'
import { listKeys } from 'components/ListsMenu/listsHooks'
import { ListId } from 'lib/ListService'
import { SupabaseClient, useSupabaseClient } from 'lib/supabaseClient'
import { useMutation, useQueryClient } from 'react-query'

export type ReorderListArgs = {
	source: number
	destination: number
}

export default function useReorderList(listId: string) {
	const supabaseClient = useSupabaseClient()
	const queryClient = useQueryClient()

	return useMutation(
		({ source, destination }: ReorderListArgs) =>
			reorderItem({ source, destination, listId }, supabaseClient),
		{
			onError: e => {
				showNotification({
					color: 'red',
					message: 'Unable to add item.',
				})
				console.error(e)
			},
			onSuccess: () => {
				return queryClient.invalidateQueries(listKeys.detail(listId))
			},
		},
	)
}

async function reorderItem(
	{
		source,
		destination,
		listId,
	}: { source: number; destination: number; listId: string },
	supabaseClient: SupabaseClient,
) {
	console.log('drag ended', source, destination)

	const { data, error: queryError } = await supabaseClient
		.from('list_items')
		.select('*')
		.order('order', { ascending: true })
		.eq('list_id', listId)

	if (queryError) throw new Error(queryError.message)

	console.log('old order', data)
	// remove item, source and dest are 1 based
	const item = data.splice(source - 1, 1)
	// place in ne spot
	data.splice(destination - 1, 0, item[0])

	const newData = data.map((oldData, i) => ({ ...oldData, order: i + 1 }))

	const { error } = await supabaseClient.from('list_items').upsert(newData)

	if (error) {
		throw new Error(error.message)
	}
}
