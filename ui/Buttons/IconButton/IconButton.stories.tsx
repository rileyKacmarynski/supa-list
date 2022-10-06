import { ComponentMeta, ComponentStory } from '@storybook/react'
import { IconSettings } from '@tabler/icons'
import IconButton from './IconButton'
import { colorOptions } from '.storybook/preview'

export default {
	title: 'UI/Buttons/IconButton',
	component: IconButton,
	argTypes: {
		color: { control: 'select', options: colorOptions },
	},
	args: {
		disabled: false,
	},
} as ComponentMeta<typeof IconButton>

const Template: ComponentStory<typeof IconButton> = args => (
	<IconButton {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
	Icon: IconSettings,
}

export const Filled = Template.bind({})
Filled.args = {
	Icon: IconSettings,
	variant: 'filled',
}

export const Transparent = Template.bind({})
Transparent.args = {
	Icon: IconSettings,
	variant: 'transparent',
}

export const Outline = Template.bind({})
Outline.args = {
	Icon: IconSettings,
	variant: 'outline',
}
