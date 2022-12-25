import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ListData } from 'components/List'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '__tests__/testUtils'
import ListsMenu, { ListsMenuProps } from './ListsMenu'
import { getTestListName, makeTestList } from './listTestUtils'
import * as listHooks from './useLists'

vi.mock('./useLists')

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

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('renders lists', () => {
		const list = makeTestList(5)

		const returnValue = useSWRReturnValue(list)
		vi.mocked(listHooks.useFetchLists).mockReturnValue(returnValue)

		mountComponent()

		list.forEach(list =>
			expect(screen.getByText(list.name)).toBeInTheDocument(),
		)
	})

	it('shows empty state', () => {
		const returnValue = useSWRReturnValue([])
		vi.mocked(listHooks.useFetchLists).mockReturnValue(returnValue)

		mountComponent()

		expect(screen.getByTestId('lists-empty-state')).toBeInTheDocument()
	})

	it('shows active list', () => {
		const lists = makeTestList(4)
		const returnValue = useSWRReturnValue(lists)
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
		const returnValue = useSWRReturnValue(lists)
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
			trigger: renameMock,
			isMutating: false,
		})

		mountComponent({ activeListId: '1' })

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

		expect(renameMock).toHaveBeenCalledWith(listItem.id, listName)
	})

	it('can delete item', async () => {
		const lists = makeTestList(3)
		const listItem = lists[1]
		const remove = vi.fn()
		vi.mocked(listHooks.useDeleteList).mockReturnValue({
			trigger: remove,
			isMutating: false,
		})

		mountComponent({ activeListId: '1' })

		const listItemEl = within(screen.getByTestId(`lists-${listItem.id}`))
		listItemEl.getByRole('button', { name: /open list menu/i }).click()

		const menuItem = await listItemEl.findByRole('menuitem', {
			name: /delete/i,
		})
		menuItem.click()

		expect(remove).toHaveBeenCalledWith(listItem.id)
	})

	it('can create item', async () => {
		const create = vi.fn()
		const listName = getTestListName()
		vi.mocked(listHooks.useCreateLists).mockReturnValue(create)

		mountComponent()

		const input = screen.getByLabelText(/list name/i)
		await userEvent.type(input, listName)

		const submitButton = screen.getByLabelText(/submit/i)
		await userEvent.click(submitButton)

		expect(create).toHaveBeenCalledWith(listName)
	})

	it('validates input', async () => {
		const create = vi.fn()

		mountComponent()

		const submitButton = screen.getByLabelText(/list name/i)
		await userEvent.click(submitButton)

		expect(create).not.toHaveBeenCalled()
	})
})

function useSWRReturnValue(lists: ListData[]) {
	return {
		data: {
			lists,
			error: null,
		},
		isLoading: false,
		error: null,
		mutate: vi.fn(),
		isValidating: false,
	}
}
