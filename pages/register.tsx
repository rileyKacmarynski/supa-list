import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AuthForm from 'components/AuthForm'
import { useNotifications } from 'ui/Notifications'
import { useSession } from '@supabase/auth-helpers-react'
import { useSupabaseClient } from 'lib/supabaseClient'
import { randomColorOption } from 'ui/Theme'
import { LoginCredentials } from 'components/AuthForm/AuthForm'

export default function Register() {
	// const { session, signUp } = useAuth()
	const supabaseClient = useSupabaseClient()
	const session = useSession()
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const { showNotification } = useNotifications()

	useEffect(() => {
		if (session) {
			router.push('/app')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onSignUp: (
		credentials: LoginCredentials,
	) => Promise<string | undefined> = async credentials => {
		setLoading(true)

		const avatarColor = randomColorOption()

		// const { error } = await signUp(credentials)
		const { error } = await supabaseClient.auth.signUp({
			...credentials,
			options: {
				data: { avatarColor },
			},
		})

		setLoading(false)

		if (error) {
			return 'Unable to create account'
		} else {
			showNotification({
				title: 'Congrats!',
				message: 'Your account has been created.',
			})
			router.push('/app')
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
				submit={onSignUp}
				type="register"
				navigateToOtherType={() => router.replace('login')}
				loading={loading}
			/>
		</div>
	)
}
