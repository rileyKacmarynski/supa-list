import { Box, List, LoadingOverlay, Navbar, Stack, Title } from '@mantine/core'
import { AnimatePresence, motion } from 'framer-motion'
import { ListId } from 'lib/listService'
import React from 'react'
import { ListForm } from './ListForm'
import { ListItem } from './ListItem'

export interface ListActions {
	// I don't care what is returned. I'm giving the updated lists to the component
	setActive(id: ListId): Promise<unknown>
	renameItem(id: ListId, name: string): Promise<unknown>
	deleteItem(id: ListId): Promise<unknown>
	createList(name: string): Promise<unknown>
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

const animateProps = {
	animate: { opacity: 1, height: 'auto' },
	exit: { opacity: 0, height: 0, x: -50 },
	initial: { opacity: 0, height: 0 },
}

const ListsMenu: React.FC<ListsMenuProps> = ({
	lists,
	activeListId,
	listActions,
	loading,
}) => {
	return (
		<Navbar.Section grow sx={theme => ({ width: '100%' })}>
			<LoadingOverlay
				visible={loading}
				overlayBlur={2}
				transitionDuration={500}
			/>
			<Stack sx={{ marginBottom: '1rem' }}>
				<List listStyleType="none">
					<AnimatePresence>
						{!lists.length && !loading && (
							<motion.div key={-2} {...animateProps}>
								<Stack
									sx={theme => ({
										textAlign: 'center',
										padding: `0 ${theme.spacing.sm}px`,
									})}
									data-testid="lists-empty-state"
								>
									<Title
										order={3}
										sx={theme => ({
											fontSize: theme.fontSizes.md,
											padding: theme.spacing.lg,
											color:
												theme.colorScheme === 'dark'
													? theme.colors.dark[2]
													: theme.colors.gray[6],
										})}
									>
										Get started by creating a list.
									</Title>
								</Stack>
							</motion.div>
						)}
						{lists.map(list => (
							<motion.div key={list.id} {...animateProps}>
								<ListItem
									item={list}
									listActions={listActions}
									isActive={activeListId === list.id}
								/>
							</motion.div>
						))}
						{!loading && (
							<motion.div {...animateProps} key={-1}>
								<Box
									component="li"
									sx={theme => ({ padding: `0 ${theme.spacing.xs}px` })}
								>
									<ListForm onSubmit={listActions.createList} />
								</Box>
							</motion.div>
						)}
					</AnimatePresence>
				</List>
			</Stack>
		</Navbar.Section>
	)
}

export default ListsMenu
