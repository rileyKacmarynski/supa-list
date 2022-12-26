import { showNotification } from '@mantine/notifications'
import { useUser } from '@supabase/auth-helpers-react'
import { ListId } from 'lib/ListService'
import { SupabaseClient, useSupabaseClient } from 'lib/supabaseClient'
import { useMutation } from 'react-query'

export type AddItemArgs = {
	text: string
}

export default function useAddItem(listId: string) {
	const supabaseClient = useSupabaseClient()
	const user = useUser()

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
		},
	)
}

async function addItem(
	{ text, userId, listId }: { text: string; userId: string; listId: ListId },
	supabaseClient: SupabaseClient,
) {
	const { error } = await supabaseClient.from('list_items').insert({
		list_id: listId,
		text: text,
		created_by: userId,
	})

	if (error) {
		throw new Error(error.message)
	}
}
