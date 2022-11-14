import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { act } from 'react-dom/test-utils'
import Lists, { ListActions, ListId } from './Lists'
import { makeTestList } from './listTestUtils'

const defaultList = makeTestList(5)

export default {
	title: 'Components/Lists',
	component: Lists,
	argTypes: {},
	args: {
		lists: defaultList,
		listActions: {
			deleteItem: (id: ListId) => console.log('deleting item', id),
			renameItem: (id: ListId) => console.log('renaming item', id),
			setActive: (id: ListId) => console.log('active item', id),
		},
	},
} as ComponentMeta<typeof Lists>

const Template: ComponentStory<typeof Lists> = args => {
	const [activeItem, setActiveItem] = useState('3')

	args = {
		...args,
		activeListId: activeItem,
		listActions: {
			...args.listActions,
			setActive: (id: string) => Promise.resolve(setActiveItem(id)),
		},
	}

	return <Lists {...args} />
}

export const Primary = Template.bind({})
