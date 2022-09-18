import {
  Paper,
  Group,
  Stack,
  TextInput,
  PasswordInput,
  Anchor,
  Button,
  Text,
} from '@mantine/core'
import { upperFirst } from '@mantine/hooks'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { LoginCredentials, AuthResponse } from '../../services/auth/AuthClient'

type ErrorMessage = string

export interface AuthFormProps {
  submit: (credentials: LoginCredentials) => Promise<ErrorMessage | undefined>
  type: 'login' | 'register'
  navigateToOtherType: () => void
  loading: boolean
}

interface Inputs {
  email: string
  password: string
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  submit,
  navigateToOtherType,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const [loginError, setLoginError] = useState<string | undefined>()

  const onSubmit: SubmitHandler<Inputs> = async inputs => {
    const error = await submit(inputs)
    if (error) {
      setLoginError(error)
    }
  }

  return (
    <Paper radius="md" p="xl" sx={{ width: '380px' }} withBorder>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="hello@gmail.com"
            {...register('email', { required: true })}
            error={errors.email && 'Invalid email'}
          />
          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            {...register('password', { required: true })}
            error={
              errors.password && 'Password should include at least 6 characters'
            }
          />
        </Stack>
        {loginError && (
          <Text mt="md" color="red">
            {loginError}
          </Text>
        )}
        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => navigateToOtherType()}
            size="xs"
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button disabled={loading} type="submit">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  )
}

export default AuthForm
