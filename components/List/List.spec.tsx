import { faker } from '@faker-js/faker'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '__tests__/testUtils'
import List, { ListItem, ListData, ListProps } from './List'

const createList: (items?: ListItem[]) => ListData = (items = []) => {
	const userId = faker.datatype.uuid()

	return {
		id: faker.datatype.uuid(),
		name: faker.commerce.product(),
		createdAt: faker.date.past(),
		lastModified: new Date(),
		items,
		createdBy: userId,
		contributors: [userId],
	}
}

describe('<List />', () => {
	const mountComponent = (props: Partial<ListProps> = {}) => {
		const { list = undefined, isLoading = false } = props

		return renderWithProviders(<List list={list} isLoading={isLoading} />)
	}

	it('render the list name', () => {
		const list = createList()
		mountComponent({ list })

		expect(screen.queryByText(list.name)).toBeInTheDocument()
	})

	it('shows the empty state if there is no list', () => {
		mountComponent()

		expect(screen.queryByTestId('list-emptyState')).toBeInTheDocument()
	})

	it('shows the item empty state if there are no list items', () => {
		const list = createList()
		mountComponent({ list })

		expect(screen.queryByTestId('list-itemsEmptyState')).toBeInTheDocument()
	})
})
