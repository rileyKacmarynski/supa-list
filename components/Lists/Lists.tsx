import {
	ActionIcon,
	Box,
	createStyles,
	List,
	LoadingOverlay,
	Menu,
	Navbar,
	NavLink,
	Stack,
	TextInput,
	Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useClickOutside } from '@mantine/hooks'
import { IconDots, IconEdit, IconPlus, IconTrash } from '@tabler/icons'
import React, { useState } from 'react'
import IconButton from 'ui/Buttons/IconButton'
import { useTheme } from 'ui/Theme'

export type ListId = string

export interface ListActions {
	setActive(id: ListId): Promise<void>
	renameItem(id: ListId, name: string): Promise<void>
	deleteItem(id: ListId): Promise<void>
	createList(name: string): Promise<void>
}

export type List = {
	name: string
	id: ListId
}
export interface ListsMenuProps {
	lists: List[]
	activeListId: ListId | null
	listActions: ListActions
	loading: boolean
}

const ListsMenu: React.FC<ListsMenuProps> = ({
	lists,
	activeListId,
	listActions,
	loading,
}) => {
	return (
		<>
			<Navbar.Section
				sx={theme => ({
					textAlign: 'center',
					paddingTop: theme.spacing.lg,
					paddingBottom: theme.spacing.sm,
				})}
			>
				<Title
					order={2}
					sx={theme => ({ fontWeight: 'normal', fontSize: theme.fontSizes.xl })}
				>
					Lists
				</Title>
			</Navbar.Section>
			<Navbar.Section grow sx={{ width: '100%' }}>
				<LoadingOverlay
					visible={loading}
					overlayBlur={2}
					transitionDuration={500}
				/>
				{!lists.length && !loading ? (
					<Stack sx={{ textAlign: 'center' }} data-testid="lists-empty-state">
						<Title
							order={3}
							sx={theme => ({
								fontSize: theme.fontSizes.md,
								color:
									theme.colorScheme === 'dark'
										? theme.colors.dark[2]
										: theme.colors.gray[6],
							})}
						>
							Get started by creating a list.
						</Title>
						<ListForm onSubmit={listActions.createList} />
					</Stack>
				) : (
					<Stack>
						<List listStyleType="none">
							{lists.map(list => (
								<ListItem
									key={list.id}
									item={list}
									listActions={listActions}
									isActive={activeListId === list.id}
								/>
							))}
							{!loading && (
								<Box
									component="li"
									sx={theme => ({ padding: `0 ${theme.spacing.xs}px` })}
								>
									<ListForm onSubmit={listActions.createList} />
								</Box>
							)}
						</List>
					</Stack>
				)}
			</Navbar.Section>
		</>
	)
}

interface ListItemProps {
	listActions: ListActions
	item: List
	isActive: boolean
}

const ListItem: React.FC<ListItemProps> = ({ listActions, item, isActive }) => {
	const [renaming, setRenaming] = useState(false)
	const ref = useClickOutside(() => setRenaming(false))
	const { primaryColorOption } = useTheme()

	const onRename = async (name: string) => {
		await listActions.renameItem(item.id, name)
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
							deleteItem={() => listActions.deleteItem(item.id)}
							renameItem={() => setRenaming(true)}
						/>
					}
				/>
			)}
		</li>
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

interface ListFormProps {
	onSubmit: (name: string) => Promise<void>
	initialValue?: string
	autoFocus?: boolean
}

const ListForm: React.FC<ListFormProps> = ({
	onSubmit,
	initialValue,
	autoFocus = false,
}) => {
	const [loading, setLoading] = useState(false)
	const { classes } = useFormStyles()
	const form = useForm({
		initialValues: {
			name: initialValue ?? '',
		},
	})

	const submit = async (values: typeof form.values) => {
		if (values.name) {
			setLoading(true)
			await onSubmit(values.name)
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
			}}
		>
			<TextInput
				id="name"
				name="name"
				variant="unstyled"
				placeholder="create new list"
				aria-label="list name"
				classNames={{ wrapper: classes.wrapper, input: classes.input }}
				autoFocus={autoFocus}
				{...form.getInputProps('name')}
			/>
			<IconButton
				type="submit"
				Icon={IconPlus}
				size="sm"
				aria-label="submit"
				loading={loading}
			/>
		</Box>
	)
}

// todo: can I make this a mapped type?
interface ListOptionsProps {
	renameItem(): void
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

export default ListsMenu
