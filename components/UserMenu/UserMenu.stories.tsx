import { ComponentMeta, ComponentStory } from '@storybook/react'
import { User } from '@supabase/supabase-js'
import UserMenu from './UserMenu'

export default {
  title: 'Components/UserMenu',
  component: UserMenu,
  argTypes: {
    signOut: { action: 'signOut' },
  },
  args: {
    user: {
      id: '123',
      email: 'user@domain.com',
    } as User,
  },
} as ComponentMeta<typeof UserMenu>

const Template: ComponentStory<typeof UserMenu> = args => <UserMenu {...args} />

export const Primary = Template.bind({})
