import { Checkbox, createStyles, Text } from '@mantine/core'
import { IconGripVertical, IconX } from '@tabler/icons'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import IconButton from '../Buttons/IconButton'

const useStyles = createStyles(theme => ({
	item: {
		display: 'flex',
		position: 'relative',
		alignItems: 'center',
		borderRadius: theme.radius.md,
		padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,
		marginBottom: theme.spacing.sm,

		transition: 'color .1s ease',

		'&:after': {
			content: '""',
			position: 'absolute',
			width: `calc(100% - 2 * ${theme.spacing.xs}px)`,
			left: theme.spacing.xs,
			bottom: '0',
			height: '2px',
			backgroundColor:
				theme.colorScheme === 'dark'
					? theme.colors.dark[5]
					: theme.colors.gray[2],
		},
	},

	itemDragging: {
		boxShadow: theme.shadows.sm,
		backgroundColor:
			theme.colorScheme === 'dark'
				? theme.colors.dark[5]
				: theme.colors.gray[2],
	},

	itemCompleted: {
		color:
			theme.colorScheme === 'dark'
				? theme.colors.dark[3]
				: theme.colors.gray[5],
	},

	checkbox: {
		marginLeft: 'auto',
	},

	dragHandle: {
		...theme.fn.focusStyles(),
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		color:
			theme.colorScheme === 'dark'
				? theme.colors.dark[1]
				: theme.colors.gray[6],
		paddingRight: theme.spacing.md,
	},
}))

export interface ListItem {
	id: string
	order: number
	text: string
	completed: boolean
}

export interface onDragEndArgs {
	item: ListItem
	source: number
	destination: number
}

export interface DragAndDropListProps {
	items: ListItem[]
	toggleItemCompleted: (item: ListItem) => void
	deleteItem: (item: ListItem) => void
	onDragEnd: (args: onDragEndArgs) => void
}

const DragAndDropList: React.FC<DragAndDropListProps> = ({
	items,
	onDragEnd,
	toggleItemCompleted,
	deleteItem,
}) => {
	const { classes, cx } = useStyles()

	const draggableItems = items.map((item, index) => (
		<Draggable key={item.id} index={index} draggableId={item.id}>
			{(provided, snapshot) => (
				<motion.li
					animate={{ opacity: 1, height: 'auto', overflow: 'hidden' }}
					exit={{ opacity: 0, height: 0, x: -50 }}
					initial={{ opacity: 0, height: 0, x: -50 }}
					ref={provided.innerRef}
					{...provided.draggableProps}
				>
					<div
						className={cx(classes.item, {
							[classes.itemDragging]: snapshot.isDragging,
							[classes.itemCompleted]: item.completed,
						})}
					>
						<div {...provided.dragHandleProps} className={classes.dragHandle}>
							<IconGripVertical size={18} stroke={1.5} />
						</div>
						<Text>{item.text}</Text>
						<Checkbox
							sx={{ cursor: 'pointer' }}
							className={classes.checkbox}
							onChange={() => toggleItemCompleted(item)}
							checked={item.completed}
							color="gray"
							aria-label="completed"
							radius="xl"
							size="sm"
						/>
						<IconButton
							sx={theme => ({
								marginLeft: theme.spacing.xs,
							})}
							Icon={IconX}
							onClick={() => deleteItem(item)}
						/>
					</div>
				</motion.li>
			)}
		</Draggable>
	))

	return (
		<DragDropContext
			onDragEnd={({ destination, source }) => {
				const item = items.find(i => i.order === source.index + 1)
				if (!item) throw new Error('Unable to find item')
				if (!destination) return

				onDragEnd({
					item,
					source: source.index,
					destination: destination.index,
				})
			}}
		>
			<Droppable droppableId="dnd-list" direction="vertical">
				{provided => (
					<ul
						style={{ width: '100%', listStyle: 'none', padding: 0 }}
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						<AnimatePresence initial={false}>
							{draggableItems}
							{provided.placeholder}
						</AnimatePresence>
					</ul>
				)}
			</Droppable>
		</DragDropContext>
	)
}

export default DragAndDropList
