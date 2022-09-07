import React from 'react'
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
  header: 'This is a header',
  navbar: 'This is a navbar',
}
