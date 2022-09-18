import { useListState } from '@mantine/hooks'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { useEffect } from 'react'
import DragAndDropList, { ListItem, onDragEndArgs } from './DragAndDropList'

export default {
  title: 'UI/DragAndDropList',
  component: DragAndDropList,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof DragAndDropList>

// This will have to wired in to supabase in the actual
// app, but this works pretty well
const Template: ComponentStory<typeof DragAndDropList> = args => {
  const [state, handlers] = useListState(
    listItems.sort((a, b) => a.order - b.order),
  )

  const completeItem: (item: ListItem) => void = ({ completed, order }) => {
    handlers.setItemProp(order - 1, 'completed', !completed)
  }

  const deleteItem = (item: ListItem) => {
    handlers.remove(item.order - 1)
    handleOrderChange()
  }

  const onDragEnd = ({ item, source, destination }: onDragEndArgs) => {
    handlers.reorder({ from: source, to: destination })
    handleOrderChange()
  }

  const handleOrderChange = () => {
    handlers.apply((item, index) => {
      return { ...item, order: (index ?? 0) + 1 }
    })
  }

  return (
    <DragAndDropList
      {...args}
      items={state}
      toggleItemCompleted={completeItem}
      deleteItem={deleteItem}
      onDragEnd={onDragEnd}
    />
  )
}

const listItems: ListItem[] = [
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
