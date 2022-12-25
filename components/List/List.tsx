import {
	Box,
	createStyles,
	LoadingOverlay,
	ScrollArea,
	TextInput,
	Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconPlus } from '@tabler/icons'
import React, { useState } from 'react'
import IconButton from 'ui/Buttons/IconButton'
import DragAndDropList from 'ui/DragAndDropList'
import {
	DragAndDropItem,
	OnDragEndArgs,
} from 'ui/DragAndDropList/DragAndDropList'
// import useAddItem from './hooks/useAddItem'
// import useToggleCompleted from './hooks/__mocks__/useToggleCompleted'

import { useAddItem, useToggleCompleted } from './hooks'

export interface ListItem {
	id: string
	text: string
	createdBy: string
	order: number
	createdAt: Date
	completed: boolean
}

export interface ListData {
	id: string
	name: string
	lastModified: Date
	createdAt: Date
	items: ListItem[]
	// will need to figure more out here
	createdBy: string
	contributors: string[]
}

export interface ListProps {
	isLoading: boolean
	list?: ListData
}

const List: React.FC<ListProps> = ({ isLoading, list }) => {
	return (
		<Box component="section" sx={{ height: '100%' }} data-testid="todos">
			{/* at some point the list will be loaded server side and we'll let prefetching do it's thing */}
			{/* if not I'll have to move the scroll box guy in here probably should do that anyway */}
			<LoadingOverlay
				visible={isLoading}
				overlayBlur={2}
				transitionDuration={500}
			/>
			{!list && !isLoading && <ListEmptyState />}
			{list && !isLoading && <Title order={1}>{list.name}</Title>}
			{list && <ListItems list={list} />}
		</Box>
	)
}

const ListItems: React.FC<{ list: ListData }> = ({ list }) => {
	const { trigger } = useToggleCompleted()
	const onDeleteItem = (item: DragAndDropItem) => {
		console.log('deleting item', item)
	}

	const onDragEnd = (args: OnDragEndArgs) => {
		console.log('drag ended', args)
	}

	const toggleItemCompleted = (item: DragAndDropItem) => {
		console.log('item completed', item)
		trigger(item.id)
	}

	const onSubmit = (text: string) => {
		return Promise.resolve()
	}

	return (
		<Box>
			{list && !list.items.length ? (
				<ListItemsEmptyState />
			) : (
				<ScrollArea
					offsetScrollbars
					sx={{ width: '100vw', position: 'relative' }}
				>
					<DragAndDropList
						items={list?.items ?? []}
						deleteItem={onDeleteItem}
						onDragEnd={onDragEnd}
						toggleItemCompleted={toggleItemCompleted}
					/>
				</ScrollArea>
			)}
			<ItemForm />
		</Box>
	)
}

export const ItemForm = () => {
	const [loading, setLoading] = useState(false)
	const { trigger } = useAddItem()
	const { classes } = useFormStyles()
	const form = useForm({
		initialValues: {
			text: '',
		},
	})

	const onSubmit = (text: string) => {
		trigger(text)
	}

	const submit = async (values: typeof form.values) => {
		if (values.text) {
			setLoading(true)
			onSubmit(values.text)
			setLoading(false)
			form.reset()
		}
	}

	return (
		<Box
			component="form"
			onSubmit={form.onSubmit(submit)}
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'end',
				gap: '1rem',
			}}
		>
			<TextInput
				id="name"
				name="name"
				variant="unstyled"
				placeholder="Add item to list"
				aria-label="item text input"
				sx={{ flexGrow: 1 }}
				classNames={{ wrapper: classes.wrapper, input: classes.input }}
				{...form.getInputProps('text')}
			/>
			<IconButton
				type="submit"
				Icon={IconPlus}
				size="sm"
				aria-label="add item to list"
				loading={loading}
			/>
		</Box>
	)
}

const useFormStyles = createStyles(theme => {
	const isDarkTheme = theme.colorScheme === 'dark'
	const borderColor = isDarkTheme ? theme.colors.dark[6] : theme.colors.gray[3]
	const primaryColor = theme.colors[theme.primaryColor][8]

	return {
		wrapper: {
			borderBottom: `1px solid ${borderColor}`,
			marginBottom: '-1px',
			'&:focus-within': {
				borderBottom: `1px solid ${primaryColor}`,
			},
		},
		input: {
			padding: 0,
		},
	}
})

const ListEmptyState = () => (
	<h1 data-testid="list-emptyState">Get started by creating a list</h1>
)

const ListItemsEmptyState = () => (
	<h2 data-testid="list-itemsEmptyState">Add an item to the list</h2>
)

export default List
