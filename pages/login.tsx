import { useSession } from '@supabase/auth-helpers-react'
import AuthForm from 'components/AuthForm'
import { LoginCredentials } from 'components/AuthForm/AuthForm'
import { useSupabaseClient } from 'lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useNotifications } from 'ui/Notifications'

export default function Login() {
	const supabaseClient = useSupabaseClient()
	const session = useSession()
	// const { signIn, session } = useAuth()
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const { showNotification } = useNotifications()

	useEffect(() => {
		if (session) {
			router.push('/app')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session])

	const onSignIn = async (credentials: LoginCredentials) => {
		setLoading(true)

		const { error } = await supabaseClient.auth.signInWithPassword(credentials)

		setLoading(false)

		if (error) {
			return error.message
		} else {
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
