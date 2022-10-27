import {
	AuthChangeEvent,
	AuthError,
	createClient,
	Subscription,
} from '@supabase/supabase-js'
// @ts-ignore
import { v4 as uuid } from 'uuid'
import { AuthResponse, LoginCredentials, Session, User } from '.'
import { randomColorOption } from '../../ui/Theme'

export class AuthClient {
	constructor() {
		const url = process.env.NEXT_PUBLIC_SUPABASE_URL
		const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
		if (!url || !key) throw new Error('Unable to read supabase configuration')

		this._supabaseClient = createClient(url, key)
		this._user = null
	}

	private _supabaseClient
	private _user: User | null
	private _stateChangeEmitters: Map<string, Subscription> = new Map()

	get user(): User | null {
		return this._user
	}

	async getSession() {
		const {
			data: { session },
		} = await this._supabaseClient.auth.getSession()
		return session
	}

	async signUp(credentials: LoginCredentials): Promise<AuthResponse> {
		const avatarColor = randomColorOption()
		const result = await this._supabaseClient.auth.signUp({
			...credentials,
			options: {
				data: { avatarColor },
			},
		})

		this._notifyAllSubscribers('SIGNED_IN')

		return {
			user: result.data.user,
			session: result.data.session,
			error: result.error,
		}
	}

	async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
		const {
			data: { user, session },
			error,
			...rest
		} = await this._supabaseClient.auth.signInWithPassword(credentials)

		console.log('session', session)
		console.log('user', user)

		if (error) {
			return { error, session: null, user: null }
		}

		if (!user) {
			// shouldn't get here, error above should be defined
			throw new Error('User is null')
		}

		const profile = await this._getProfile(user)
		this._user = {
			...user,
			user_metadata: { avatarColor: profile.avatar_color },
		}

		this._notifyAllSubscribers('SIGNED_IN')

		return {
			user: this._user,
			session,
			error: null,
			...rest,
		}
	}

	async signOut() {
		const result = await this._supabaseClient.auth.signOut()
		this._notifyAllSubscribers('SIGNED_OUT')

		return result
	}

	onAuthStateChange(
		callback: (event: AuthChangeEvent, session: Session | null) => void,
	): {
		data: Subscription | null
		error: AuthError | null
	} {
		try {
			const id: string = uuid()
			const subscription: Subscription = {
				id,
				callback,
				unsubscribe: () => {
					this._stateChangeEmitters.delete(id)
				},
			}
			this._stateChangeEmitters.set(id, subscription)
			return { data: subscription, error: null }
		} catch (e) {
			return { data: null, error: e as AuthError }
		}
	}

	private async _notifyAllSubscribers(event: AuthChangeEvent) {
		const {
			data: { session },
		} = await this._supabaseClient.auth.getSession()
		if (session && session.user) {
			session.user = { ...session.user, ...this._user }
		}

		this._stateChangeEmitters.forEach(x => x.callback(event, session))
	}

	private async _getProfile(user: User) {
		const { data: profile } = await this._supabaseClient
			.from('profiles')
			.select('*')
			.eq('user_id', user.id)

		if (!profile) throw new Error('Profile not found in signin request')

		return profile[0]
	}
}

export const client = new AuthClient()
