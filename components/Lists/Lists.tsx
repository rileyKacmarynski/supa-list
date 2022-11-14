import { ActionIcon, Box, List, Menu, NavLink } from '@mantine/core'
import { IconDots, IconEdit, IconTrash } from '@tabler/icons'
import React from 'react'
import { useTheme } from 'ui/Theme'

export type ListId = string

export interface ListActions {
	setActive(id: ListId): Promise<void>
	renameItem(id: ListId): Promise<void>
	deleteItem(id: ListId): Promise<void>
}

export interface ListsProps {
	lists: {
		name: string
		id: ListId
	}[]
	activeListId: ListId
	listActions: ListActions
}

const Lists: React.FC<ListsProps> = ({ lists, activeListId, listActions }) => {
	const { primaryColorOption } = useTheme()

	return (
		<Box sx={{ width: 240 }}>
			{!lists.length ? (
				<p>no lists</p>
			) : (
				<List listStyleType="none">
					{lists.map(list => (
						<NavLink
							label={list.name}
							active={list.id === activeListId}
							onClick={() => listActions.setActive(list.id)}
							color={primaryColorOption}
							component="li"
							data-testid={`lists-${list.id}`}
							key={list.id}
							rightSection={
								<ListOptions
									deleteItem={() => listActions.deleteItem(list.id)}
									renameItem={() => listActions.renameItem(list.id)}
								/>
							}
						/>
					))}
				</List>
			)}
		</Box>
	)
}

// todo: can I make this a mapped type?
interface ListOptionsProps {
	renameItem(): Promise<void>
	deleteItem(): Promise<void>
}

const ListOptions: React.FC<ListOptionsProps> = ({
	renameItem,
	deleteItem,
}) => {
	return (
		<Menu>
			{/* This seems hacky, but I don't know how else to stop propagation */}
			<div onClick={e => e.stopPropagation()}>
				<Menu.Target>
					<ActionIcon
						variant="subtle"
						role="button"
						aria-label="open list menu"
					>
						<IconDots size={16} />
					</ActionIcon>
				</Menu.Target>
			</div>
			<Menu.Dropdown>
				<Menu.Item onClick={renameItem} icon={<IconEdit size={14} />}>
					Rename
				</Menu.Item>
				<Menu.Item
					name="delete"
					color="red"
					onClick={deleteItem}
					icon={<IconTrash size={14} />}
				>
					Delete this list
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	)
}

export default Lists
