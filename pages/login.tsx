import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AuthForm from 'components/AuthForm'
import { LoginCredentials } from 'lib/auth'
import { useAuth } from 'lib/auth/AuthContextProvider'
import { useNotifications } from 'ui/Notifications'

export default function Login() {
  const { signIn, session } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { showNotification } = useNotifications()

  useEffect(() => {
    if (session) {
      router.replace('/app')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSignIn = async (credentials: LoginCredentials) => {
    setLoading(true)

    const { error } = await signIn(credentials)
    setLoading(false)

    if (error) {
      return error.message
    } else {
      showNotification({
        title: 'Hey!',
        message: 'Welcome back.',
      })
      router.replace('/app')
    }
  }

  return (
    <AuthForm
      submit={onSignIn}
      type="login"
      navigateToOtherType={() => router.replace('register')}
      loading={loading}
    />
  )
}
