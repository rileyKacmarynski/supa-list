---
to: <%= path %>/<%= Name %>/<%= Name %>.stories.tsx
---
import { ComponentMeta, ComponentStory } from '@storybook/react'
import <%= Name %> from './<%= Name %>'

export default {
  title: '<%= Name %>',
  component: <%= Name %>,
  argTypes: {
  },
  args: {
  },
} as ComponentMeta<typeof <%= Name %>>

const Template: ComponentStory<typeof <%= Name %>> = args => <<%= Name %> {...args} />

export const Primary = Template.bind({})
