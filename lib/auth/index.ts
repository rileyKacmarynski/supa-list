import {
	User as SupaUser,
	Session as SupaSession,
	AuthError,
} from '@supabase/supabase-js'
import { ColorOption } from '../../ui/Theme'

export interface Session extends SupaSession {}
export interface User extends Omit<SupaUser, 'user_metadata'> {
	user_metadata?: { avatarColor?: ColorOption }
}
export interface LoginCredentials {
	email: string
	password: string
}

export type AuthResponse = {
	error: AuthError | null
	user: User | null
	session: Session | null
}
