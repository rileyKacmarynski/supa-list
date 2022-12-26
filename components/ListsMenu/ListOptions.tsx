import { ActionIcon, Menu } from '@mantine/core'
import { IconDots, IconEdit, IconTrash } from '@tabler/icons'
import React from 'react'

// todo: can I make this a mapped type?
export interface ListOptionsProps {
	renameItem(): void
	deleteItem(): void
}

export const ListOptions: React.FC<ListOptionsProps> = ({
	renameItem,
	deleteItem,
}) => {
	// {/* This seems hacky, but I don't know how else to stop propagation */}
	return (
		<div onClick={e => e.stopPropagation()}>
			<Menu>
				<Menu.Target>
					<ActionIcon
						variant="subtle"
						role="button"
						aria-label="open list menu"
					>
						<IconDots size={16} />
					</ActionIcon>
				</Menu.Target>
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
		</div>
	)
}
