import { Checkbox, createStyles, ScrollArea, Text } from '@mantine/core'
import { IconGripVertical, IconX } from '@tabler/icons'
import {
	AnimatePresence,
	LayoutGroup,
	motion,
	Reorder,
	useDragControls,
} from 'framer-motion'
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useTheme } from 'ui/Theme'
import IconButton from '../Buttons/IconButton'

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
	const { classes, cx } = useStyles()

	const [reorderItems, setReorderItems] = useState(items)

	const reorderComplete = () => {
		const changedPosition = reorderItems.reduce(
			(changed, item, index) => (item.id !== items[index].id ? true : changed),
			false,
		)

		if (changedPosition) {
			onDragEnd(reorderItems)
		}
	}

	// always take what we get from the
	// client as the source of truth
	useEffect(() => {
		setReorderItems(items)
	}, [items])

	return (
		<Reorder.Group
			axis="y"
			values={reorderItems}
			onReorder={setReorderItems}
			as="ul"
			className={classes.ul}
		>
			{reorderItems.map(item => (
				<DragItem
					key={item.id}
					deleteItem={deleteItem}
					item={item}
					toggleItemCompleted={toggleItemCompleted}
					onDragEnd={reorderComplete}
				/>
			))}
		</Reorder.Group>
	)
}

type DragItemProps = {
	item: DragAndDropItem
	onDragEnd(): void
} & Pick<DragAndDropListProps, 'toggleItemCompleted' | 'deleteItem'>

const DragItem: React.FC<DragItemProps> = ({
	item,
	toggleItemCompleted,
	deleteItem,
	onDragEnd,
}) => {
	const { classes, cx } = useStyles()
	const controls = useDragControls()
	const [dragging, setDragging] = useState(false)
	const theme = useTheme()

	function onDrag<TElement extends Element>(e: React.MouseEvent<TElement>) {
		setDragging(true)
		controls.start(e)
	}

	function onPointerUp<TElement extends Element>(
		e: React.MouseEvent<TElement>,
	) {
		setDragging(false)
		onDragEnd()
	}

	return (
		// <motion.li
		// 	key={item.id}
		// 	animate={{ opacity: 1, height: 'auto', overflow: 'hidden' }}
		// 	exit={{ opacity: 0, height: 0 }}
		// 	initial={{ opacity: 0, height: 0 }}
		// >
		<Reorder.Item
			key={item.id}
			value={item}
			className={cx(classes.item, {
				[classes.itemDragging]: dragging,
				[classes.itemCompleted]: item.completed,
			})}
			whileTap={{
				boxShadow: theme.shadows.sm,
				backgroundColor:
					theme.colorScheme === 'dark'
						? theme.colors.dark[5]
						: theme.colors.gray[2],
			}}
			dragListener={false}
			dragControls={controls}
			style={{ borderRadius: '12px', position: 'relative' }}
			animate={{ opacity: 1, height: 'auto', overflow: 'hidden' }}
			exit={{ opacity: 0, height: 0 }}
			initial={{ opacity: 0, height: 0 }}
		>
			<div
				className={classes.dragHandle}
				onPointerDown={onDrag}
				onPointerUp={onPointerUp}
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
		</Reorder.Item>
		// </motion.li>
	)
}

export default DragAndDropList
