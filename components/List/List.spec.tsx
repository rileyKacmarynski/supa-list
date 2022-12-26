import { faker } from '@faker-js/faker'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '__tests__/testUtils'
import List, { ListProps } from './List'
import {
	useAddItem,
	useToggleCompleted,
	useDeleteItem,
	useFetchList,
} from './hooks'

vi.mock('./hooks')

describe('<List />', () => {
	const mountComponent = (props: Partial<ListProps> = {}) => {
		const { listId = faker.datatype.uuid() } = props

		return renderWithProviders(<List listId={listId} />)
	}

	it('render the list name', () => {
		const list = createList()

		vi.mocked(useFetchList).mockReturnValue({
			data: list,
			isLoading: false,
		} as unknown as any)

		mountComponent({ listId: list.id })

		expect(screen.queryByText(list.name)).toBeInTheDocument()
	})

	it('shows the empty state if there is no list', () => {
		vi.mocked(useFetchList).mockReturnValue({
			data: null,
			isLoading: false,
		} as unknown as any)

		mountComponent()

		expect(screen.queryByTestId('list-emptyState')).toBeInTheDocument()
	})

	it('shows the item empty state if there are no list items', () => {
		const list = createList()
		vi.mocked(useFetchList).mockReturnValue({
			data: list,
			isLoading: false,
		} as unknown as any)

		mountComponent({ listId: list.id })

		expect(screen.queryByTestId('list-itemsEmptyState')).toBeInTheDocument()
	})

	it('shows list items', () => {
		const numItems = faker.datatype.number(5)
		const list = createList(numItems)

		vi.mocked(useFetchList).mockReturnValue({
			data: list,
			isLoading: false,
		} as unknown as any)

		mountComponent({ listId: list.id })

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

		vi.mocked(useFetchList).mockReturnValue({
			data: list,
			isLoading: false,
		} as unknown as any)

		mountComponent({ listId: list.id })

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
		vi.mocked(useFetchList).mockReturnValue({
			data: list,
			isLoading: false,
		} as unknown as any)

		mountComponent({ listId: list.id })

		await userEvent.click(screen.getByLabelText(/delete item/i))

		expect(removeItem).toHaveBeenCalled()
	})
})

function createList(numItems = 0) {
	const userId = faker.datatype.uuid()

	const items = Array.from({ length: numItems }, (v, i) => ({
		createdAt: faker.date.recent(5),
		createdBy: userId,
		id: faker.datatype.uuid(),
		order: i + 1,
		text: faker.finance.transactionDescription(),
		completed: false,
	}))

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
