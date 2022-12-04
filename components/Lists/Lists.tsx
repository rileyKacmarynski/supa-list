import {
	ActionIcon,
	Box,
	Button,
	createStyles,
	Flex,
	List,
	Menu,
	NavLink,
	Stack,
	TextInput,
	Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconDots, IconEdit, IconPlus, IconTrash } from '@tabler/icons'
import React, { useState } from 'react'
import IconButton from 'ui/Buttons/IconButton'
import { useTheme } from 'ui/Theme'

export type ListId = string

export interface ListActions {
	setActive(id: ListId): Promise<void>
	renameItem(id: ListId): Promise<void>
	deleteItem(id: ListId): Promise<void>
	createList(name: string): Promise<void>
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
	const { primaryColorOption, colorScheme } = useTheme()

	return (
		<Box sx={{ width: 240 }}>
			{!lists.length ? (
				<Stack data-testid="lists-empty-state">
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
					<NewListForm createList={listActions.createList} />
				</Stack>
			) : (
				<Stack>
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
						<Box
							component="li"
							sx={theme => ({ padding: ` 0 ${theme.spacing.xs}px` })}
						>
							<NewListForm createList={listActions.createList} />
						</Box>
					</List>
				</Stack>
			)}
		</Box>
	)
}

const useFormStyles = createStyles(theme => {
	const isDarkTheme = theme.colorScheme === 'dark'
	const borderColor = isDarkTheme ? theme.colors.dark[6] : theme.colors.gray[3]
	const primaryColor = theme.colors[theme.primaryColor][8]

	return {
		wrapper: {
			borderBottom: `1px solid ${borderColor}`,
			'&:focus-within': {
				borderBottom: `1px solid ${primaryColor}`,
			},
		},
	}
})

type NewListFormProps = Pick<ListActions, 'createList'>

const NewListForm: React.FC<NewListFormProps> = ({ createList }) => {
	const [loading, setLoading] = useState(false)
	const { classes } = useFormStyles()
	const form = useForm({
		initialValues: {
			name: '',
		},
	})

	const submit = async (values: typeof form.values) => {
		if (values.name) {
			setLoading(true)
			await createList(values.name)
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
				aria-label="new list name"
				classNames={{ wrapper: classes.wrapper }}
				{...form.getInputProps('name')}
			/>
			<IconButton
				type="submit"
				Icon={IconPlus}
				size="sm"
				aria-label="create new list"
				loading={loading}
			/>
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
