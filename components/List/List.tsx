import { Box, LoadingOverlay, Title } from '@mantine/core'
import React from 'react'

export interface ListItem {
	id: string
	text: string
	createdBy: string
	order: number
	createdAt: Date
}

export interface ListData {
	id: string
	name: string
	lastModified: Date
	createdAt: Date
	items: ListItem[]
	// will need to figure more out here
	createdBy: string
	contributors: string[]
}

export interface ListProps {
	isLoading: boolean
	list?: ListData
}

const List: React.FC<ListProps> = ({ isLoading, list }) => {
	return (
		<Box component="section" sx={{ height: '100%' }} data-testid="todos">
			{/* at some point the list will be loaded server side and we'll let prefetching do it's thing */}
			{/* if not I'll have to move the scroll box guy in here probably should do that anyway */}
			<LoadingOverlay
				visible={isLoading}
				overlayBlur={2}
				transitionDuration={500}
			/>
			{!list && <ListEmptyState />}
			{list && !isLoading && <Title order={1}>{list.name}</Title>}
			{list && !list.items.length && <ListItemsEmptyState />}
		</Box>
	)
}

const ListEmptyState = () => (
	<h1 data-testid="list-emptyState">Get started by creating a list</h1>
)

const ListItemsEmptyState = () => (
	<h2 data-testid="list-itemsEmptyState">Add an item to the list</h2>
)

export default List
