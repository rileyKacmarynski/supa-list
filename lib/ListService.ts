import { SupabaseClient } from './supabaseClient'
import { getErrorMessage } from './utils'

export type ListId = string

export interface List {
	id: string
	name: string
	lastModified: Date
	createdAt: Date
	// will need to figure more out here
	createdBy: string
	contributors: string[]
}

export interface ListItem {
	id: string
	text: string
	createdBy: string
	order: number
	createdAt: Date
	completed: boolean
}

export interface ListDetail extends List {
	items: ListItem[]
}
export default class ListService {
	constructor(private _supabaseClient: SupabaseClient) {}

	getLists = async () => {
		const { data, error } = await this._supabaseClient.from('lists').select('*')

		if (error) {
			throw new Error(error.message)
		}

		return mapLists(data)
	}

	deleteList = async (id: ListId) => {
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

	renameList = async (id: ListId, name: string) => {
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

export function MapListDetails(data: any): ListDetail {
	return {
		id: data.id,
		name: data.name,
		contributors: data.contributors,
		createdAt: new Date(data.created_at),
		lastModified: new Date(data.last_modified),
		createdBy: data.created_by,
		items: (data.list_items as any[])?.map(l => ({
			id: l.id,
			text: l.text,
			createdAt: new Date(l.created_at),
			createdBy: l.created_by,
			order: l.order,
			completed: l.completed,
		})) as ListItem[],
	}
}

// this type is really gross to work with
// hide it here
export function mapLists(data: any[] | null): List[] {
	if (!data) return []

	return data?.map(l => ({
		id: l.id,
		name: l.name,
		contributors: l.contributors,
		createdAt: new Date(l.created_at),
		lastModified: new Date(l.last_modified),
		createdBy: l.created_by,
	}))
}

export type GetListsFn = ListService['getLists']
export type DeleteListFn = ListService['deleteList']
export type CreateListFn = ListService['createList']
export type RenameListFn = ListService['renameList']
