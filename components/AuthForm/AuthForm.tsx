import {
  Paper,
  Group,
  Divider,
  Stack,
  TextInput,
  PasswordInput,
  Anchor,
  Button,
  Text,
  Box,
} from '@mantine/core'
import { upperFirst } from '@mantine/hooks'
import { IconLogin } from '@tabler/icons'
import { SubmitHandler, useForm } from 'react-hook-form'
import { LoginCredentials } from '../../services/authService'

export interface AuthFormProps {
  submit: (credentials: LoginCredentials) => Promise<void>
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

  const onSubmit: SubmitHandler<Inputs> = inputs => submit(inputs)

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
