import { useSupabaseClient as useSupaClient } from '@supabase/auth-helpers-react'
import { createClient, PostgrestError } from '@supabase/supabase-js'
import { Database } from 'types/supabase'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!url || !key) throw new Error('Unable to read supabase configuration')

export default createClient<Database>(url, key)

export type SupabaseError = PostgrestError | string | null

export const useSupabaseClient = () => useSupaClient<Database>()

export type SupabaseClient = ReturnType<typeof useSupabaseClient>
