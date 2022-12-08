import { createClient } from '@supabase/supabase-js'
import { Database } from 'types/supabase'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!url || !key) throw new Error('Unable to read supabase configuration')

export default createClient<Database>(url, key)
