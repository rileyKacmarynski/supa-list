import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AuthForm from 'components/AuthForm'
import { LoginCredentials } from 'lib/auth'
import { useAuth } from 'lib/auth/AuthContextProvider'

export default function Login() {
  const { signIn, session } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

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
      // success notification and redirect to app
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
