import { PostgrestError } from '@supabase/supabase-js'
import { SupabaseError } from './supabaseClient'

export function getRandomInt(max: number) {
	return Math.floor(Math.random() * max) + 1
}

export function getErrorMessage(e: unknown) {
	return e instanceof Error ? e.message : 'An error occured.'
}

export function checkForError(error: SupabaseError) {
	if (!error) return

	console.error(error)

	const msg = typeof error === 'string' ? error : error.message

	throw new Error(msg)
}
