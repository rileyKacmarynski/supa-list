import { Box, List, LoadingOverlay, Navbar, Stack } from '@mantine/core'
import { AnimatePresence, motion, MotionProps } from 'framer-motion'
import { ListId } from 'lib/ListService'
import { useRouter } from 'next/router'
import React from 'react'
import { ListForm } from './ListForm'
import { ListItem } from './ListItem'
import { ListMenuEmptyState } from './ListMenuEmptyState'
import { useCreateList, useFetchLists } from './listsHooks'

export interface ListsMenuProps {
	activeListId: ListId | null
}

const animateProps: MotionProps = {
	animate: { opacity: 1, height: 'auto' },
	exit: { opacity: 0, height: 0 },
	initial: { opacity: 0, height: 0 },
}

const ListsMenu: React.FC<ListsMenuProps> = ({ activeListId }) => {
	const create = useCreateList()
	const lists = useFetchLists()
	const router = useRouter()

	const createList = async (name: string) => {
		const { list } = await create.mutateAsync({ name })
		if (list) {
			router.push(`/app/${list[0].id}`)
		}
	}

	const noLists = !lists.data?.length && !lists.isLoading

	return (
		<Navbar.Section grow sx={theme => ({ width: '100%' })}>
			<LoadingOverlay
				visible={lists.isLoading}
				overlayBlur={2}
				transitionDuration={500}
			/>
			<Stack sx={{ marginBottom: '1rem' }}>
				<List listStyleType="none">
					<AnimatePresence initial={false}>
						{noLists && (
							<motion.div key={-2} {...animateProps}>
								<ListMenuEmptyState />
							</motion.div>
						)}
						{lists.data?.map(list => (
							<motion.div key={list.id} {...animateProps}>
								<ListItem item={list} isActive={activeListId === list.id} />
							</motion.div>
						))}
						{!lists.isLoading && (
							<motion.div {...animateProps} key={-1}>
								<Box
									component="li"
									sx={theme => ({ padding: `0 ${theme.spacing.xs}px` })}
								>
									<ListForm
										onSubmit={createList}
										isLoading={create.isLoading}
									/>
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
