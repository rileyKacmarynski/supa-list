import { authClient } from './auth/AuthClient'
import supabaseClient from './supabaseClient'
import { getErrorMessage } from './utils'

export type ListId = string

export async function getLists() {
	try {
		const { data, error } = await supabaseClient
			.from('lists')
			.select('*')
			.order('last_modified', { ascending: false })

		return { lists: data, error }
	} catch (e) {
		return { data: null, error: getErrorMessage(e) }
	}
}

export type GetListsResult = Awaited<ReturnType<typeof getLists>>
export type GetListsArgs = Parameters<typeof getLists>

export async function getList(id: ListId) {
	try {
		const { data, error } = await supabaseClient
			.from('lists')
			.select('*, list_items(*)')
			.eq('id', id)

		if (!data) throw new Error(`unable to find list with id: ${id}`)

		return { list: data[0], error }
	} catch (e) {
		return { list: null, error: getErrorMessage(e) }
	}
}

export type GetListResult = Awaited<ReturnType<typeof getList>>
export type GetListArgs = Parameters<typeof getList>

export async function deleteList(id: string) {
	try {
		const { error } = await supabaseClient.from('lists').delete().eq('id', id)

		return { error }
	} catch (e) {
		return { error: getErrorMessage(e) }
	}
}

export type DeleteListResult = Awaited<ReturnType<typeof deleteList>>
export type DeleteListArgs = Parameters<typeof deleteList>

export async function renameList(id: string, name: string) {
	try {
		const { data, error } = await supabaseClient
			.from('lists')
			.update({ name, last_modified: new Date().toISOString() })
			.eq('id', id)
			.select()

		return { list: data, error }
	} catch (e) {
		return { error: getErrorMessage(e) }
	}
}

export type RenameListResult = Awaited<ReturnType<typeof renameList>>
export type RenameListArgs = Parameters<typeof renameList>

export async function createList(name: string) {
	try {
		const user = await authClient.getUser()

		if (!user) throw new Error('Unable to fetch user. Are you logged in?')

		const { error, data: list } = await supabaseClient
			.from('lists')
			.insert({ name, contributors: [], created_by: user.id })
			.select()

		return { error, list }
	} catch (e) {
		return { error: getErrorMessage(e) }
	}
}

export type CreateListResult = Awaited<ReturnType<typeof createList>>
export type CreateListArgs = Parameters<typeof createList>
