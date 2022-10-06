import { ComponentMeta, ComponentStory } from '@storybook/react'
import ColorSchemePicker from './ColorSchemePicker'

export default {
	title: 'UI/Inputs/ColorSchemePicker',
	component: ColorSchemePicker,
	parameters: {
		layout: 'fullscreen',
	},
} as ComponentMeta<typeof ColorSchemePicker>

const Template: ComponentStory<typeof ColorSchemePicker> = args => (
	<ColorSchemePicker {...args} />
)

export const Primary = Template.bind({})
