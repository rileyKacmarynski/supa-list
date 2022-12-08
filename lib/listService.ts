import { authClient } from './auth/AuthClient'
import supabaseClient from './supabaseClient'
import { getErrorMessage } from './utils'

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

export async function deleteList(id: string) {
	try {
		const { error } = await supabaseClient.from('lists').delete().eq('id', id)

		return { error }
	} catch (e) {
		return { error: getErrorMessage(e) }
	}
}

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