'use client'
import AuthForm from 'components/AuthForm'
import { LoginCredentials } from 'lib/auth'
import { useAuth } from 'lib/auth/AuthContextProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useNotifications } from 'ui/Notifications'

export default function Login() {
	const { signIn, session } = useAuth()
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const { showNotification } = useNotifications()

	useEffect(() => {
		if (session) {
			router.push('/app')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onSignIn = async (credentials: LoginCredentials) => {
		setLoading(true)

		const response = await signIn(credentials)
		const { error } = response

		setLoading(false)

		if (error) {
			return error.message
		} else {
			console.log(router)
			router.push('/app')
			showNotification({
				title: 'Hey!',
				message: 'Welcome back.',
			})
		}
	}

	return (
		<div
			style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
			}}
		>
			<AuthForm
				submit={onSignIn}
				type="login"
				navigateToOtherType={() => router.replace('register')}
				loading={loading}
			/>
		</div>
	)
}
