import { PostgrestError } from '@supabase/supabase-js'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { List } from 'lib/ListService'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '__tests__/testUtils'
import ListsMenu, { ListsMenuProps } from './ListsMenu'
import { getTestListName, makeTestList } from './listTestUtils'
import * as listHooks from './listsHooks'

vi.mock('./listsHooks')

describe('<ListsMenu />', () => {
	const mountComponent = (props?: Partial<ListsMenuProps>) => {
		if (!props) {
			props = {}
		}

		const { activeListId = '2', setActiveListId = vi.fn() } = props

		return renderWithProviders(
			<ListsMenu
				setActiveListId={setActiveListId}
				activeListId={activeListId}
			/>,
		)
	}

	it('renders lists', () => {
		const list = makeTestList(5)

		const returnValue = useQueryReturnValue(list)
		vi.mocked(listHooks.useFetchLists).mockReturnValue(returnValue)

		mountComponent()

		list.forEach(list =>
			expect(screen.getByText(list.name)).toBeInTheDocument(),
		)
	})

	it('shows empty state', () => {
		const returnValue = useQueryReturnValue([])
		vi.mocked(listHooks.useFetchLists).mockReturnValue(returnValue)

		mountComponent()

		expect(screen.getByTestId('lists-empty-state')).toBeInTheDocument()
	})

	it('shows active list', () => {
		const lists = makeTestList(4)
		const returnValue = useQueryReturnValue(lists)
		vi.mocked(listHooks.useFetchLists).mockReturnValue(returnValue)
		const activeItem = lists[2]

		const { container } = mountComponent({ activeListId: activeItem.id })

		const activeEl = container.querySelector('li *[data-active="true"]')
		expect(activeEl).not.toBeNull()
		expect(
			within(activeEl as HTMLElement).getByText(activeItem.name),
		).toBeInTheDocument()
	})

	it('calls setActive when item is clicked', () => {
		const lists = makeTestList(3)
		const returnValue = useQueryReturnValue(lists)
		vi.mocked(listHooks.useFetchLists).mockReturnValue(returnValue)
		const listItem = lists[1]
		const setActiveListId = vi.fn()

		mountComponent({ activeListId: '1', setActiveListId })

		screen.getByText(listItem.name).click()

		expect(setActiveListId).toHaveBeenCalledWith(listItem.id)
	})

	it('can rename item', async () => {
		const lists = makeTestList(3)
		const listItem = lists[1]
		const renameMock = vi.fn()
		vi.mocked(listHooks.useRenameList).mockReturnValue({
			mutateAsync: renameMock,
			isLoading: false,
		} as unknown as any)
		vi.mocked(listHooks.useFetchLists).mockReturnValue(
			useQueryReturnValue(lists),
		)

		mountComponent({ activeListId: listItem.id })

		// open menu and click "rename"
		const listItemEl = within(screen.getByTestId(`lists-${listItem.id}`))
		listItemEl.getByRole('button', { name: /open list menu/i }).click()

		const menuItem = await listItemEl.findByRole('menuitem', {
			name: /rename/i,
		})
		await userEvent.click(menuItem)

		// rename item
		const listName = getTestListName()
		const input = listItemEl.getByLabelText(/list name/i)
		await userEvent.clear(input)
		await userEvent.type(input, listName)

		const submitButton = listItemEl.getByLabelText(/submit/i)
		await userEvent.click(submitButton)

		expect(renameMock).toHaveBeenCalled()
	}, 10000)

	it('can delete item', async () => {
		const lists = makeTestList(3)
		const listItem = lists[1]
		const remove = vi.fn()
		vi.mocked(listHooks.useDeleteList).mockReturnValue({
			mutate: remove,
			isLoading: false,
		} as unknown as any)

		mountComponent({ activeListId: '1' })

		const listItemEl = within(screen.getByTestId(`lists-${listItem.id}`))
		listItemEl.getByRole('button', { name: /open list menu/i }).click()

		const menuItem = await listItemEl.findByRole('menuitem', {
			name: /delete/i,
		})
		menuItem.click()

		expect(remove).toHaveBeenCalled()
	})

	it('can create list', async () => {
		const create = vi.fn()
		const listName = getTestListName()
		vi.mocked(listHooks.useCreateList).mockReturnValue({
			isLoading: false,
			mutateAsync: create,
		} as unknown as any)

		mountComponent()

		const input = screen.getByLabelText(/list name/i)
		await userEvent.type(input, listName)

		const submitButton = screen.getByLabelText(/submit/i)
		await userEvent.click(submitButton)

		expect(create).toHaveBeenCalled()
	})

	it('validates input', async () => {
		const create = vi.fn()

		mountComponent()

		const submitButton = screen.getByLabelText(/list name/i)
		await userEvent.click(submitButton)

		expect(create).not.toHaveBeenCalled()
	})
})

function useQueryReturnValue<T>(lists: T) {
	return {
		data: lists,
		isLoading: false,
		error: null,
		isError: false,
		isIdle: false,
		isLoadingError: false,
		isRefetchError: false,
		isSuccess: true,
		status: 'success',
		dataUpdatedAt: 0,
		errorUpdatedAt: 0,
		failureCount: 0,
		errorUpdateCount: 0,
		isFetched: false,
		isFetchedAfterMount: false,
		isFetching: false,
		isPlaceholderData: false,
		isPreviousData: false,
		isRefetching: false,
		isStale: false,
		refetch: vi.fn(),
		remove: vi.fn(),
	} as const
}
