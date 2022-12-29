import { useListState } from '@mantine/hooks'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import DragAndDropList2, {
	DragAndDropItem,
	OnDragEndArgs,
} from './DragAndDropList'

export default {
	title: 'UI/DragAndDropList',
	component: DragAndDropList2,
	parameters: {
		layout: 'fullscreen',
	},
} as ComponentMeta<typeof DragAndDropList2>

// This will have to wired in to supabase in the actual
// app, but this works pretty well
const Template: ComponentStory<typeof DragAndDropList2> = args => {
	const [state, handlers] = useListState(
		listItems.sort((a, b) => a.order - b.order),
	)

	const completeItem: (item: DragAndDropItem) => void = ({
		completed,
		order,
	}) => {
		handlers.setItemProp(order - 1, 'completed', !completed)
	}

	const deleteItem = (item: DragAndDropItem) => {
		handlers.remove(item.order - 1)
		handleOrderChange()
	}

	const onDragEnd = ({ item, source, destination }: OnDragEndArgs) => {
		handlers.reorder({ from: source, to: destination })
		handleOrderChange()
	}

	const handleOrderChange = () => {
		handlers.apply((item, index) => {
			return { ...item, order: (index ?? 0) + 1 }
		})
	}

	return (
		<DragAndDropList2
			{...args}
			items={state}
			toggleItemCompleted={completeItem}
			deleteItem={deleteItem}
			onDragEnd={onDragEnd}
		/>
	)
}

const listItems: DragAndDropItem[] = [
	{ id: '1', order: 1, text: 'item 1', completed: true },
	{ id: '2', order: 2, text: 'item 2', completed: false },
	{ id: '3', order: 3, text: 'item 3', completed: false },
	{ id: '4', order: 4, text: 'item 4', completed: false },
	{ id: '5', order: 5, text: 'item 5', completed: false },
	{ id: '6', order: 6, text: 'item 6', completed: false },
]

export const Primary = Template.bind({})
Primary.args = {
	items: listItems,
}
Primary.play = async ({ args, canvasElement }) => {}
