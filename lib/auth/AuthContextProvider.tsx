import React, { useContext, useEffect, useState } from 'react'
import { LoginCredentials, Session, User } from '.'
import { AuthClient } from './AuthClient'

export type AuthContext = Omit<AuthClient, 'onAuthStateChange'>

const AuthContext = React.createContext<AuthContext | undefined>(undefined)

type AuthProviderProps = {
	children: React.ReactNode
	client: AuthClient
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children, client }) => {
	// save session in the provider so we can trigger rerenders
	const [session, setSession] = useState<Session | null>(null)
	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		let mounted = true

		const session = client.session
		if (mounted) {
			if (session) {
				setSession(session)
				setUser(client.user)
			}
		}

		const { data: subscription } = client.onAuthStateChange(
			(_event, session) => {
				setSession(session)
				setUser(session?.user ?? null)
			},
		)

		return () => {
			mounted = false
			subscription?.unsubscribe()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const values: AuthContext = {
		session,
		user,
		signIn: (credentials: LoginCredentials) => client.signIn(credentials),
		signUp: (credentials: LoginCredentials) => client.signUp(credentials),
		signOut: () => client.signOut(),
	}

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const authContext = useContext(AuthContext)
	if (authContext === undefined) {
		throw new Error('useAuth must be used withing an AuthProvider')
	}

	return authContext
}

export default AuthProvider
