import { getUser, LoginCredentials, signIn } from '../services/authService'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AuthForm from '../components/AuthForm'
import { showNotification } from '@mantine/notifications'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (getUser()) {
      router.replace('/')
    }
  }, [])

  const onSignIn = async (credentials: LoginCredentials) => {
    setLoading(true)

    const { error } = await signIn(credentials)
    setLoading(false)

    if (error) {
      return 'Invalid username or password'
    } else {
      // success notification and redirect to app
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
