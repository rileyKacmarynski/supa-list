import { showNotification } from '@mantine/notifications'
import listKeys from 'lib/listKeys'
import { ListId, MapListDetails } from 'lib/ListService'
import { SupabaseClient, useSupabaseClient } from 'lib/supabaseClient'
import { useQuery } from 'react-query'

export default function useFetchList(id: ListId) {
	const supabaseClient = useSupabaseClient()

	return useQuery(listKeys.detail(id), () => getList(id, supabaseClient), {
		onError: e => {
			showNotification({
				color: 'red',
				message: 'Unable to find list',
			})
			console.error(e)
		},
	})
}

export async function getList(id: ListId, supabaseClient: SupabaseClient) {
	const { data } = await supabaseClient
		.from('lists')
		.select('*, list_items(*)')
		.order('order', { foreignTable: 'list_items', ascending: true })
		.eq('id', id)

	console.log('fetched items', data![0].list_items)

	if (!data || data.length === 0) return null

	return MapListDetails(data[0])
}
