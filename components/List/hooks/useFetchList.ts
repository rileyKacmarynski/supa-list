import { showNotification } from '@mantine/notifications'
import { listKeys } from 'components/ListsMenu/listsHooks'
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

async function getList(id: ListId, supabaseClient: SupabaseClient) {
	const { data } = await supabaseClient
		.from('lists')
		.select('*, list_items(*)')
		.eq('id', id)

	if (!data || data.length === 0) return null

	return MapListDetails(data[0])
}
