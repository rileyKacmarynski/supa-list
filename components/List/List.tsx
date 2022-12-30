import { Box, createStyles, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconPlus } from '@tabler/icons'
import { LayoutGroup, motion, MotionConfig } from 'framer-motion'
import { ListDetail, ListId } from 'lib/ListService'
import React from 'react'
import IconButton from 'ui/Buttons/IconButton'
import DragAndDropList from 'ui/DragAndDropList'
import { DragAndDropItem } from 'ui/DragAndDropList/DragAndDropList'

import {
	useAddItem,
	useDeleteItem,
	useToggleCompleted,
	useReorderList,
} from './hooks'

export interface ListProps {
	list: ListDetail
}

const List: React.FC<ListProps> = ({ list }) => {
	return (
		<Box
			component="section"
			sx={{ height: '100%', width: '100%' }}
			data-testid="todos"
		>
			<Title order={1}>{list.name}</Title>
			<ListItems list={list} />
		</Box>
	)
}

const ListItems: React.FC<{ list: ListDetail }> = ({ list }) => {
	const toggleCompleted = useToggleCompleted(list.id)
	const removeItem = useDeleteItem(list.id)
	const reorder = useReorderList(list.id)

	const onDeleteItem = (item: DragAndDropItem) => {
		console.log('deleting item', item)
		removeItem.mutate({ itemId: item.id })
	}

	const onDragEnd = (items: DragAndDropItem[]) => {
		reorder.mutate({
			items,
		})
	}

	const toggleItemCompleted = (item: DragAndDropItem) => {
		console.log('item completed', item)
		toggleCompleted.mutate({
			completed: !item.completed,
			itemId: item.id,
		})
	}

	return (
		<Box>
			<LayoutGroup id={list.id}>
				{list && !list.items.length ? (
					<ListItemsEmptyState />
				) : (
					<DragAndDropList
						items={list.items ? [...list.items] : []}
						deleteItem={onDeleteItem}
						onDragEnd={onDragEnd}
						toggleItemCompleted={toggleItemCompleted}
					/>
				)}
				<ItemForm listId={list.id} />
			</LayoutGroup>
		</Box>
	)
}

export const ItemForm: React.FC<{ listId: ListId }> = ({ listId }) => {
	const { mutate } = useAddItem(listId)
	const { classes } = useFormStyles()
	const form = useForm({
		initialValues: {
			text: '',
		},
	})

	const submit = (values: typeof form.values) => {
		if (values.text) {
			mutate({ text: values.text })
			form.reset()
		}
	}

	return (
		<motion.div layout>
			<Box
				component="form"
				onSubmit={form.onSubmit(submit)}
				sx={theme => ({
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'end',
					gap: '1rem',
					paddingLeft: theme.spacing.sm,
					paddingRight: theme.spacing.sm,
				})}
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
				/>
			</Box>
		</motion.div>
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
			fontSize: '1rem',
		},
	}
})

const ListItemsEmptyState = () => (
	<motion.h2 layout data-testid="list-itemsEmptyState">
		Add an item to the list
	</motion.h2>
)

export default List
