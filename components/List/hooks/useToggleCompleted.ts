import { showNotification } from '@mantine/notifications'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import listKeys from 'lib/listKeys'
import { SupabaseClient } from 'lib/supabaseClient'
import { useMutation, useQueryClient } from 'react-query'

export type ToggleCompleteArgs = {
	itemId: string
	completed: boolean
}

export default function useToggleComplete() {
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
			onSuccess: completed => {
				return queryClient.invalidateQueries(listKeys.detail(completed.list_id))
			},
		},
	)
}

async function markComplete(
	{ itemId, completed }: { itemId: string; completed: boolean },
	supabaseClient: SupabaseClient,
) {
	console.log('completed value', completed)
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
