import { showNotification } from '@mantine/notifications'
import { useUser } from '@supabase/auth-helpers-react'
import listKeys from 'lib/listKeys'
import { ListDetail, ListId, ListItem } from 'lib/ListService'
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

	const queryKey = listKeys.detail(listId)
	const itemId = crypto.randomUUID()

	return useMutation(
		({ text }: AddItemArgs) =>
			addItem({ text, userId: user.id, listId, id: itemId }, supabaseClient),
		{
			onError: e => {
				showNotification({
					color: 'red',
					message: 'Unable to add item.',
				})
				console.error(e)
			},
			onMutate: async ({ text }) => {
				await queryClient.cancelQueries({ queryKey })

				const previousList = queryClient.getQueryData<ListDetail>(queryKey)

				queryClient.setQueryData(
					queryKey,
					(oldList: ListDetail | undefined) => {
						if (!oldList)
							throw new Error('How are we reordering a list that doesnt exist?')

						const newItem: ListItem = {
							id: itemId,
							text,
							completed: false,
							order: oldList.items.length + 1,
							createdAt: new Date().toString(),
							createdBy: user.id,
						}

						return {
							...oldList,
							items: [...oldList.items, newItem],
						}
					},
				)

				return { previousList }
			},
			onSettled: () => {
				return queryClient.invalidateQueries({ queryKey })
			},
			onSuccess: () => {
				return queryClient.invalidateQueries(listKeys.detail(listId))
			},
		},
	)
}

async function addItem(
	{
		id,
		text,
		userId,
		listId,
	}: { id: string; text: string; userId: string; listId: ListId },
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
		id,
		list_id: listId,
		text: text,
		created_by: userId,
		order: count + 1,
	})

	if (error) {
		throw new Error(error.message)
	}
}
