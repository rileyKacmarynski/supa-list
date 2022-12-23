import { ComponentMeta, ComponentStory } from '@storybook/react'
import List from './List'

export default {
	title: 'List',
	component: List,
	argTypes: {},
	args: {},
} as ComponentMeta<typeof List>

const Template: ComponentStory<typeof List> = args => <List {...args} />

export const Primary = Template.bind({})
