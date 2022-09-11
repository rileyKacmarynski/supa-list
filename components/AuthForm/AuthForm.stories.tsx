import { ComponentMeta, ComponentStory } from '@storybook/react'
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

export const Register = Template.bind({})
