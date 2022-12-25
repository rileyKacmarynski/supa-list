import { ListData, ListItem } from 'components/List'
import { SupabaseClient, useSupabaseClient } from './supabaseClient'
import { getErrorMessage } from './utils'

export type ListId = string

export default class ListService {
	constructor(private _supabaseClient: SupabaseClient) {}

	getLists = async () => {
		try {
			const { data, error } = await this._supabaseClient
				.from('lists')
				.select('*, list_items(*)')

			const lists = mapLists(data)

			return { lists, error }
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

// this type is really gross to work with
// hide it here
function mapLists(data: any[] | null): ListData[] {
	if (!data) return []

	return data?.map((l: any) => ({
		id: l.id,
		name: l.name,
		contributors: l.contributors,
		createdAt: new Date(l.created_at),
		lastModified: new Date(l.last_modified),
		createdBy: l.created_by,
		items: (l.list_items as any[])?.map(l => ({
			id: l.id,
			text: l.text,
			createdAt: new Date(l.created_at),
			createdBy: l.created_by,
			order: l.order,
			completed: l.completed,
		})) as ListItem[],
	}))
}

export type GetListFn = ListService['getList']
export type GetListsFn = ListService['getLists']
export type DeleteListFn = ListService['deleteList']
export type CreateListFn = ListService['createList']
export type RenameListFn = ListService['renameList']
