import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import ListsMenu, { ListId } from './Lists'
import { makeTestList } from './listTestUtils'

const defaultList = makeTestList(5)

export default {
	title: 'Components/Lists',
	component: ListsMenu,
	argTypes: {},
	args: {
		lists: defaultList,
		listActions: {
			deleteItem: (id: ListId) => console.log('deleting item', id),
			renameItem: (id: ListId, name: string) =>
				console.log('renaming item', id, name),
			setActive: (id: ListId) => console.log('active item', id),
			createList: (name: string) => console.log('create list', name),
		},
	},
} as ComponentMeta<typeof ListsMenu>

const Template: ComponentStory<typeof ListsMenu> = args => {
	const [activeItem, setActiveItem] = useState('3')

	args = {
		...args,
		activeListId: activeItem,
		listActions: {
			...args.listActions,
			setActive: (id: string) => Promise.resolve(setActiveItem(id)),
		},
	}

	return <ListsMenu {...args} />
}

export const Primary = Template.bind({})

export const EmptyList = Template.bind({})
EmptyList.args = {
	...Primary.args,
	lists: [],
}
