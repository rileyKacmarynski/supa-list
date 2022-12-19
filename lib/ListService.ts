import { SupabaseClient } from './supabaseClient'
import { getErrorMessage } from './utils'

export type ListId = string

export default class ListService {
	constructor(private _supabaseClient: SupabaseClient) {}

	getLists = async () => {
		try {
			const { data, error } = await this._supabaseClient
				.from('lists')
				.select('*')

			return { lists: data, error }
		} catch (e) {
			return { data: null, error: getErrorMessage(e) }
		}
	}

	getList = async (id: ListId) => {
		try {
			const { data, error } = await this._supabaseClient
				.from('lists')
				.select('*, list_items(*)')
				.eq('id', id)

			if (!data) throw new Error(`unable to find list with id: ${id}`)

			return { list: data[0], error }
		} catch (e) {
			return { list: null, error: getErrorMessage(e) }
		}
	}

	deleteList = async (id: string) => {
		try {
			const { error } = await this._supabaseClient
				.from('lists')
				.delete()
				.eq('id', id)

			return { error }
		} catch (e) {
			return { error: getErrorMessage(e) }
		}
	}

	renameList = async (id: string, name: string) => {
		try {
			const { data, error } = await this._supabaseClient
				.from('lists')
				.update({ name, last_modified: new Date().toISOString() })
				.eq('id', id)
				.select()

			return { list: data, error }
		} catch (e) {
			return { error: getErrorMessage(e) }
		}
	}

	createList = async (name: string, userId: string) => {
		try {
			const { error, data: list } = await this._supabaseClient
				.from('lists')
				.insert({ name, contributors: [], created_by: userId })
				.select()

			return { error, list }
		} catch (e) {
			return { error: getErrorMessage(e) }
		}
	}
}

export function useListService(supabaseClient: SupabaseClient) {
	return new ListService(supabaseClient)
}
