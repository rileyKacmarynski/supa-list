import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AuthForm from '../components/AuthForm'
import { LoginCredentials } from '../lib/auth'
import { useAuth } from '../lib/auth/AuthContextProvider'

export default function Register() {
  const { session, signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.replace('/app')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSignUp: (
    credentials: LoginCredentials,
  ) => Promise<string | undefined> = async credentials => {
    setLoading(true)

    const { error } = await signUp(credentials)
    setLoading(false)

    if (error) {
      return 'Unable to create account'
    } else {
      // success notification and redirect to app
      router.replace('/app')
    }
  }

  return (
    <AuthForm
      submit={onSignUp}
      type="register"
      navigateToOtherType={() => router.replace('login')}
      loading={loading}
    />
  )
}
