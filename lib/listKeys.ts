import { ListId } from './ListService'

const listKeys = {
	all: ['lists'] as const,
	details: () => [...listKeys.all, 'detail'] as const,
	detail: (listId: ListId) => [...listKeys.details(), listId] as const,
}

export default listKeys
