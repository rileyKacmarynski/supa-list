import { faker } from '@faker-js/faker'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '__tests__/testUtils'
import List, { ListProps } from './List'
import { useAddItem, useToggleCompleted, useDeleteItem } from './hooks'

vi.mock('./hooks')

describe('<List />', () => {
	const mountComponent = (props: Partial<ListProps> = {}) => {
		const { list = createList() } = props

		return renderWithProviders(<List list={list} />)
	}

	it('render the list name', () => {
		const list = createList()

		mountComponent({ list })

		expect(screen.queryByText(list.name)).toBeInTheDocument()
	})

	it('shows the item empty state if there are no list items', () => {
		const list = createList()

		mountComponent({ list })

		expect(screen.queryByTestId('list-itemsEmptyState')).toBeInTheDocument()
	})

	it('shows list items', () => {
		const numItems = faker.datatype.number(5)
		const list = createList(numItems)

		mountComponent({ list })

		for (let item of list.items) {
			expect(screen.queryByText(item.text)).toBeInTheDocument()
		}
	})

	it('adds an item to the list', async () => {
		const addItem = vi.fn()
		const listText = faker.finance.accountName()

		vi.mocked(useAddItem).mockReturnValue({
			mutate: addItem,
			mutateAsync: addItem,
			isLoading: false,
		} as unknown as any)

		mountComponent()

		const input = screen.getByLabelText(/item text input/i)
		await userEvent.type(input, listText)
		await userEvent.click(
			screen.getByRole('button', { name: /add item to list/i }),
		)

		expect(addItem).toHaveBeenCalledWith({ text: listText })
	})

	it('marks an item as complete', async () => {
		const markItemComplete = vi.fn()
		const list = createList(1)

		vi.mocked(useToggleCompleted).mockReturnValue({
			mutate: markItemComplete,
			mutateAsync: markItemComplete,
			isLoading: false,
		} as unknown as any)

		mountComponent({ list })

		await userEvent.click(screen.getByLabelText(/completed/i))

		expect(markItemComplete).toHaveBeenCalled()
	})

	it('deletes an item', async () => {
		const removeItem = vi.fn()
		const list = createList(1)

		vi.mocked(useDeleteItem).mockReturnValue({
			mutate: removeItem,
			mutateAsync: removeItem,
			isLoading: false,
		} as unknown as any)
		mountComponent({ list })

		await userEvent.click(screen.getByLabelText(/delete item/i))

		expect(removeItem).toHaveBeenCalled()
	})
})

function createList(numItems = 0) {
	const userId = faker.datatype.uuid()

	const items = Array.from({ length: numItems }, (v, i) => ({
		createdAt: faker.date.recent(5).toString(),
		createdBy: userId,
		id: faker.datatype.uuid(),
		order: i + 1,
		text: faker.finance.transactionDescription(),
		completed: false,
	}))

	return {
		id: faker.datatype.uuid(),
		name: faker.commerce.product(),
		createdAt: faker.date.past().toString(),
		lastModified: new Date().toString(),
		items,
		createdBy: userId,
		contributors: [userId],
	}
}
