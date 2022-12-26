import { showNotification } from '@mantine/notifications'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { SupabaseClient } from 'lib/supabaseClient'
import { useMutation } from 'react-query'

export type ToggleCompleteArgs = {
	itemId: string
	completed: boolean
}

export default function useToggleComplete() {
	const supabaseClient = useSupabaseClient()

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
		},
	)
}

async function markComplete(
	{ itemId, completed }: { itemId: string; completed: boolean },
	supabaseClient: SupabaseClient,
) {
	const { error } = await supabaseClient
		.from('list_items')
		.update({ completed })
		.eq('id', itemId)

	if (error) {
		throw new Error(error.message)
	}
}
