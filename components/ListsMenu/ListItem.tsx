import { Box, Loader, NavLink } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import { ListId } from 'lib/ListService'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useTheme } from 'ui/Theme'
import { ListForm } from './ListForm'
import { ListOptions } from './ListOptions'
import { List } from './ListsMenu'
import { useDeleteList, useRenameList } from './useLists'

export interface ListItemProps {
	item: List
	isActive: boolean
	setActiveListId: Dispatch<SetStateAction<ListId | null>>
}

export const ListItem: React.FC<ListItemProps> = ({
	item,
	isActive,
	setActiveListId,
}) => {
	const { trigger: rename } = useRenameList()
	const { trigger: remove, isMutating } = useDeleteList()
	const [renaming, setRenaming] = useState(false)
	const ref = useClickOutside(() => setRenaming(false))
	const { primaryColorOption } = useTheme()

	const onRename = async (name: string) => {
		await rename(item.id, name)
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
					onClick={() => setActiveListId(item.id)}
					color={primaryColorOption}
					key={item.id}
					rightSection={
						isMutating ? (
							<Loader color="gray" size="xs" />
						) : (
							<ListOptions
								deleteItem={() => remove(item.id)}
								renameItem={() => setRenaming(true)}
							/>
						)
					}
				/>
			)}
		</li>
	)
}
