import { ComponentMeta, ComponentStory } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import { LoginCredentials } from '../../services/authService'
import AuthForm from './AuthForm'

export default {
  title: 'Components/AuthForm',
  component: AuthForm,
  args: {
    type: 'login',
  },
  argTypes: {
    navigateToOtherType: { action: 'navigate' },
    submit: { action: 'submit' },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof AuthForm>

const Template: ComponentStory<typeof AuthForm> = args => <AuthForm {...args} />

export const Login = Template.bind({})

export const LoginError = Template.bind({})
LoginError.args = {
  submit: (credentials: LoginCredentials) =>
    Promise.resolve('Invalid username or password.'),
}
LoginError.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const emailInput = canvas.getByLabelText(/email/i)
  const passwordInput = canvas.getByLabelText(/password/i)

  userEvent.type(emailInput, 'username')
  userEvent.type(passwordInput, 'password')

  userEvent.click(canvas.getByText(/login/i))
}

export const Register = Template.bind({})
Register.args = {
  type: 'register',
}
