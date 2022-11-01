import React from 'react'
import { userEvent, within, screen } from '@storybook/testing-library'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Layout from './Layout'

export default {
	title: 'UI/Layout',
	component: Layout,
	parameters: {
		layout: 'fullscreen',
	},
} as ComponentMeta<typeof Layout>

const Template: ComponentStory<typeof Layout> = args => <Layout {...args} />

export const Primary = Template.bind({})
Primary.args = {
	header: <div>header content</div>,
}
Primary.parameters = {
	skipLayout: true,
}

export const WithNav = Template.bind({})
WithNav.parameters = Primary.parameters
WithNav.args = {
	...Primary.args,
	navbar: <div>navbar content</div>,
}

export const LightTheme = Template.bind({})
LightTheme.args = Primary.args
LightTheme.parameters = Primary.parameters
LightTheme.play = async ({ canvasElement }) => {
	const canvas = within(canvasElement)

	const settingsButton = canvas.getByRole('button', {
		name: /open settings/i,
	})
	userEvent.click(settingsButton)

	const lightSwitch = await screen.findByLabelText(/Light/i)
	userEvent.click(lightSwitch)
}
