import { ComponentMeta, ComponentStory } from '@storybook/react'
import Avatar from './Avatar'
import { colorOptions } from '.storybook/preview'

export default {
	title: 'UI/Avatar',
	component: Avatar,
	argTypes: {
		color: { control: 'select', options: colorOptions },
	},
	args: {
		initials: 'RK',
	},
} as ComponentMeta<typeof Avatar>

const Template: ComponentStory<typeof Avatar> = args => <Avatar {...args} />

export const Primary = Template.bind({})
