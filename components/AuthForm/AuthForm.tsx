import {
  Anchor,
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { upperFirst } from '@mantine/hooks'
import { useState } from 'react'
import { LoginCredentials } from '../../lib/auth'

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
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: value =>
        value.length >= 8 ? null : 'Passord must be 8 characters or more',
    },
  })

  const [loginError, setLoginError] = useState<string | undefined>()

  async function submitForm(inputs: Inputs) {
    const error = await submit(inputs)
    if (error) {
      setLoginError(error)
    }
  }

  return (
    <Paper radius="md" p="xl" sx={{ width: '380px' }} withBorder>
      <form onSubmit={form.onSubmit(submitForm)}>
        <Stack>
          <TextInput
            withAsterisk
            label="Email"
            placeholder="hello@gmail.com"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            withAsterisk
            label="Password"
            placeholder="Your password"
            {...form.getInputProps('password')}
          />
        </Stack>
        {loginError && (
          <Text mt="md" color="red">
            {loginError}
          </Text>
        )}
        <Group position="apart" mt="xl">
          <Anchor
            data-testid="AuthForm-navigate"
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
