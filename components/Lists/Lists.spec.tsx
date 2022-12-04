import { faker } from '@faker-js/faker'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DeepPartial, renderWithProviders } from '__tests__/testUtils'
import Lists, { ListActions, ListsProps } from './Lists'
import { makeTestList, getTestListName } from './listTestUtils'

describe('<Lists />', () => {
	const defaultList = makeTestList(5)

	const createDefaultActions = (actions: Partial<ListActions>) => {
		return {
			deleteItem: vi.fn(),
			renameItem: vi.fn(),
			setActive: vi.fn(),
			createList: vi.fn(),
			...actions,
		}
	}

	const mountComponent = (props?: Partial<ListsProps>) => {
		if (!props) {
			props = {}
		}

		const {
			lists = defaultList,
			activeListId = '2',
			listActions = {
				...createDefaultActions({}),
				...props.listActions,
			},
		} = props

		return renderWithProviders(
			<Lists
				lists={lists}
				activeListId={activeListId}
				listActions={listActions}
			/>,
		)
	}

	it('renders lists', () => {
		mountComponent()

		defaultList.forEach(list =>
			expect(screen.queryByText(list.name)).toBeInTheDocument(),
		)
	})

	it('shows empty state', () => {
		mountComponent({
			lists: [],
		})

		expect(screen.queryByTestId('lists-empty-state')).toBeInTheDocument()
	})

	it('shows active list', () => {
		const lists = makeTestList(4)
		const activeItem = lists[2]
		const { container } = mountComponent({ lists, activeListId: activeItem.id })

		const activeEl = container.querySelector('li[data-active="true"]')
		expect(activeEl).not.toBeNull()
		expect(
			within(activeEl as HTMLElement).getByText(activeItem.name),
		).toBeInTheDocument()
	})

	it('calls setActive when item is clicked', () => {
		const lists = makeTestList(3)
		const listItem = lists[1]
		const setActive = vi.fn()
		const listActions = createDefaultActions({
			setActive,
		})

		mountComponent({ lists, activeListId: '1', listActions })

		screen.getByText(listItem.name).click()

		expect(setActive).toHaveBeenCalledWith(listItem.id)
	})

	it('can rename item', async () => {
		const lists = makeTestList(3)
		const listItem = lists[1]
		const renameItem = vi.fn()
		const listActions = createDefaultActions({
			renameItem,
		})

		mountComponent({ lists, activeListId: '1', listActions })

		const listItemEl = within(screen.getByTestId(`lists-${listItem.id}`))
		listItemEl.getByRole('button', { name: /open list menu/i }).click()

		const menuItem = await listItemEl.findByRole('menuitem', {
			name: /rename/i,
		})
		menuItem.click()

		expect(renameItem).toHaveBeenCalledWith(listItem.id)
	})

	it('can delete item', async () => {
		const lists = makeTestList(3)
		const listItem = lists[1]
		const deleteItem = vi.fn()
		const listActions = createDefaultActions({
			deleteItem,
		})

		mountComponent({ lists, activeListId: '1', listActions })

		const listItemEl = within(screen.getByTestId(`lists-${listItem.id}`))
		listItemEl.getByRole('button', { name: /open list menu/i }).click()

		const menuItem = await listItemEl.findByRole('menuitem', {
			name: /delete/i,
		})
		menuItem.click()

		expect(deleteItem).toHaveBeenCalledWith(listItem.id)
	})

	it('can create item', async () => {
		const createList = vi.fn()
		const listActions = createDefaultActions({
			createList,
		})
		const listName = getTestListName()

		mountComponent({ listActions })

		const input = screen.getByLabelText(/new list name/i)
		await userEvent.type(input, listName)

		const submitButton = screen.getByLabelText(/create new list/i)
		await userEvent.click(submitButton)

		expect(createList).toHaveBeenCalledWith(listName)
	})

	it('validates input', async () => {
		const createList = vi.fn()
		const listActions = createDefaultActions({
			createList,
		})

		mountComponent({ listActions })

		const submitButton = screen.getByLabelText(/create new list/i)
		await userEvent.click(submitButton)

		expect(createList).not.toHaveBeenCalled()
	})
})
