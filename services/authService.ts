import { createClient, User } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!url || !key) throw new Error('Unable to read supabase configuration')

const supabase = createClient(url, key)

export interface LoginCredentials {
  email: string
  password: string
}

export const signUp = async (credentials: LoginCredentials) => {
  return await supabase.auth.signUp(credentials)
}

export const signIn = async (credentials: LoginCredentials) => {
  return await supabase.auth.signIn(credentials)
}

export const signOut = async () => await supabase.auth.signOut()

export const getUser = () => supabase.auth.user()

export type { User }
