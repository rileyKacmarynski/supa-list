import { Box, Loader, NavLink } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import { ListId } from 'lib/ListService'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useTheme } from 'ui/Theme'
import { ListForm } from './ListForm'
import { ListOptions } from './ListOptions'
import { useDeleteList, useRenameList } from './listsHooks'

export type ListItemDisplayValues = {
	name: string
	id: ListId
}

export interface ListItemProps {
	item: ListItemDisplayValues
	isActive: boolean
}

export const ListItem: React.FC<ListItemProps> = ({ item, isActive }) => {
	const rename = useRenameList()
	const remove = useDeleteList()
	const [renaming, setRenaming] = useState(false)
	const ref = useClickOutside(() => setRenaming(false))
	const { primaryColorOption } = useTheme()
	const router = useRouter()

	const onRename = async (name: string) => {
		await rename.mutateAsync({ name, id: item.id })
		setRenaming(false)
	}

	const deleteItem = () => {
		remove.mutate(
			{ id: item.id },
			{
				onSuccess: () => {
					if (isActive) {
						router.push('/app')
					}
				},
			},
		)
	}

	return (
		<li ref={renaming ? ref : null} data-testid={`lists-${item.id}`}>
			{renaming ? (
				<Box
					sx={theme => ({
						padding: `4px ${theme.spacing.sm}px`,
					})}
				>
					<ListForm
						autoFocus
						isLoading={rename.isLoading}
						initialValue={item.name}
						onSubmit={onRename}
					/>
				</Box>
			) : (
				<NavLink
					component={Link}
					href={`/app/${item.id}`}
					label={item.name}
					active={isActive}
					color={primaryColorOption}
					key={item.id}
					rightSection={
						remove.isLoading ? (
							<Loader color="gray" size="xs" />
						) : (
							<ListOptions
								deleteItem={() => deleteItem()}
								renameItem={() => setRenaming(true)}
							/>
						)
					}
				/>
			)}
		</li>
	)
}
