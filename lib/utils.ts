import { PostgrestError } from '@supabase/supabase-js'

export function getRandomInt(max: number) {
	return Math.floor(Math.random() * max) + 1
}

export function getErrorMessage(e: unknown) {
	return e instanceof Error ? e.message : 'An error occured.'
}
