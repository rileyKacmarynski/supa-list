import { Checkbox, createStyles, Text } from '@mantine/core'
import { IconGripVertical, IconX } from '@tabler/icons'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import IconButton from '../Buttons/IconButton'

import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export interface DragAndDropItem {
	id: string
	order: number
	text: string
	completed: boolean
	[key: string]: any
}

export interface DragAndDropListProps {
	items: DragAndDropItem[]
	toggleItemCompleted: (item: DragAndDropItem) => void
	deleteItem: (item: DragAndDropItem) => void
	onDragEnd: (items: DragAndDropItem[]) => void
}

const DragAndDropList: React.FC<DragAndDropListProps> = ({
	items,
	onDragEnd,
	toggleItemCompleted,
	deleteItem,
}) => {
	const { classes } = useStyles()

	const [reorderItems, setReorderItems] = useState(items)

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	const handleDragEnd: (e: DragEndEvent) => void = (e: DragEndEvent): void => {
		const { active, over } = e
		if (over && active.id !== over.id) {
			const oldIndex = reorderItems.findIndex(i => i.id === active.id)
			const newIndex = reorderItems.findIndex(i => i.id === over.id)

			const newArray = [...arrayMove(reorderItems, oldIndex, newIndex)]
			setReorderItems(newArray)

			const changedPosition = newArray.reduce(
				(changed, item, index) =>
					item.id !== items[index].id ? true : changed,
				false,
			)

			if (changedPosition) {
				onDragEnd(newArray)
			}
		}
	}

	// always take what we get from the
	// client as the source of truth
	useEffect(() => {
		setReorderItems(items)
	}, [items])

	return (
		<motion.div layout="position">
			<DndContext
				collisionDetection={closestCenter}
				sensors={sensors}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={reorderItems}
					strategy={verticalListSortingStrategy}
				>
					<ul className={classes.ul}>
						{reorderItems.map(item => (
							<DragItem
								key={item.id}
								deleteItem={deleteItem}
								item={item}
								toggleItemCompleted={toggleItemCompleted}
							/>
						))}
					</ul>
				</SortableContext>
			</DndContext>
		</motion.div>
	)
}

type DragItemProps = {
	item: DragAndDropItem
} & Pick<DragAndDropListProps, 'toggleItemCompleted' | 'deleteItem'>

const DragItem: React.FC<DragItemProps> = ({
	item,
	toggleItemCompleted,
	deleteItem,
}) => {
	const { classes, cx } = useStyles()
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef, // drag handle ref
		transform,
		transition,
		isDragging,
	} = useSortable({ id: item.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<li
			className={cx(classes.item, {
				[classes.itemDragging]: isDragging,
				[classes.itemCompleted]: item.completed,
			})}
			ref={setNodeRef}
			style={style}
		>
			<div
				{...attributes}
				{...listeners}
				className={classes.dragHandle}
				ref={setActivatorNodeRef}
			>
				<IconGripVertical size={18} stroke={1.5} />
			</div>
			<Text sx={{ userSelect: 'none' }}>{item.text}</Text>
			<Checkbox
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
				aria-label="delete item"
				Icon={IconX}
				onClick={() => deleteItem(item)}
			/>
		</li>
	)
}

const useStyles = createStyles(theme => ({
	ul: {
		width: '100%',
		listStyle: 'none',
		padding: 0,

		'& li:last-child div': {
			marginBottom: 0,
		},
	},

	item: {
		display: 'flex',
		position: 'relative',
		alignItems: 'center',
		borderRadius: theme.radius.md,
		padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,
		marginBottom: theme.spacing.sm,
		backgroundColor: 'inherit',

		transition: 'all .1s ease',

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
		cursor: 'grab',
		color:
			theme.colorScheme === 'dark'
				? theme.colors.dark[1]
				: theme.colors.gray[6],
		paddingRight: theme.spacing.md,

		'&:active': {
			cursor: 'grabbing',
		},
	},
}))

export default DragAndDropList
