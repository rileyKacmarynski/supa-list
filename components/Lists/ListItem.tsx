import { Box, NavLink } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import React, { useState } from 'react'
import { useTheme } from 'ui/Theme'
import { ListForm } from './ListForm'
import { ListOptions } from './ListOptions'
import { ListActions, List } from './ListsMenu'

export interface ListItemProps {
	listActions: ListActions
	item: List
	isActive: boolean
}

export const ListItem: React.FC<ListItemProps> = ({
	listActions,
	item,
	isActive,
}) => {
	const [renaming, setRenaming] = useState(false)
	const ref = useClickOutside(() => setRenaming(false))
	const { primaryColorOption } = useTheme()

	const onRename = async (name: string) => {
		await listActions.rename(item.id, name)
		setRenaming(false)
	}

	return (
		<li ref={renaming ? ref : null} data-testid={`lists-${item.id}`}>
			{renaming ? (
				<Box
					sx={theme => ({
						padding: `4px ${theme.spacing.sm}px`,
					})}
				>
					<ListForm autoFocus initialValue={item.name} onSubmit={onRename} />
				</Box>
			) : (
				<NavLink
					component="div"
					label={item.name}
					active={isActive}
					onClick={() => listActions.setActive(item.id)}
					color={primaryColorOption}
					key={item.id}
					rightSection={
						<ListOptions
							deleteItem={() => listActions.remove(item.id)}
							renameItem={() => setRenaming(true)}
						/>
					}
				/>
			)}
		</li>
	)
}
