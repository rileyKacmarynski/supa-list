import { authClient } from './auth/AuthClient'
import supabaseClient from './supabaseClient'
import { ApiResponse, getErrorMessage } from './utils'
import { v4 as uuidv4 } from 'uuid'

const listQuery = `
	*,
	user_lists (
		user_id,
		role
	)
`

export async function getLists(): Promise<ApiResponse<any>> {
	try {
		const { data, error } = await supabaseClient
			.from('lists')
			.select(listQuery)
			.order('last_modified', { ascending: false })

		return { data, error }
	} catch (e) {
		return { data: null, error: getErrorMessage(e) }
	}
}

export async function deleteList(id: string) {
	try {
		const { error: ulError } = await supabaseClient
			.from('user_lists')
			.delete()
			.eq('list_id', id)
		if (ulError) {
			return { error: ulError }
		}

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
			.update({ name, last_modified: new Date() })
			.eq('id', id)
			.select()

		return { list: data, error }
	} catch (e) {
		return { error: getErrorMessage(e) }
	}
}

export async function createList(name: string) {
	try {
		// this should be in a database function, but
		// for sake of time I'll do it like this for no
		const user = await authClient.getUser()

		// insert list
		const id = uuidv4()
		// due to rls policy I can't select
		// this row until inserting the user_list
		const { error } = await supabaseClient.from('lists').insert({ name, id })

		console.log(error)

		if (error) throw new Error(error.message)

		// insert user_list
		const { error: ulError } = await supabaseClient
			.from('user_lists')
			.insert({ user_id: user?.id, list_id: id, role: 'author' })

		if (ulError) throw new Error(ulError.message)

		const { error: selectError, data: list } = await supabaseClient
			.from('lists')
			.select(listQuery)
			.eq('id', id)

		return { error: selectError, data: list }
	} catch (e) {
		return { error: getErrorMessage(e) }
	}
}
