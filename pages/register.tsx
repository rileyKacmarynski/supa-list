import { getUser, signUp } from '../services/authService'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import AuthForm from '../components/AuthForm'

export default function Register() {
  const router = useRouter()

  useEffect(() => {
    if (getUser()) {
      router.replace('/')
    }
  }, [])

  return (
    <AuthForm
      submit={signUp}
      type="register"
      navigateToOtherType={() => router.replace('login')}
    />
  )
}
