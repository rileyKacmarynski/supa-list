import { faker } from '@faker-js/faker'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DeepPartial, renderWithProviders } from '__tests__/testUtils'
import ListsMenu, { ListActions, ListsMenuProps } from './ListsMenu'
import { makeTestList, getTestListName } from './listTestUtils'

describe('<Lists />', () => {
	const defaultList = makeTestList(5)

	const createDefaultActions = (actions: Partial<ListActions>) => {
		return {
			remove: vi.fn(),
			rename: vi.fn(),
			setActive: vi.fn(),
			create: vi.fn(),
			...actions,
		}
	}

	const mountComponent = (props?: Partial<ListsMenuProps>) => {
		if (!props) {
			props = {}
		}

		const {
			lists = defaultList,
			activeListId = '2',
			loading = false,
			listActions = {
				...createDefaultActions({}),
				...props.listActions,
			},
		} = props

		return renderWithProviders(
			<ListsMenu
				loading={loading}
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

		const activeEl = container.querySelector('li *[data-active="true"]')
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
		const rename = vi.fn()
		const listActions = createDefaultActions({
			rename,
		})

		mountComponent({ lists, activeListId: '1', listActions })

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

		expect(rename).toHaveBeenCalledWith(listItem.id, listName)
	})

	it('can delete item', async () => {
		const lists = makeTestList(3)
		const listItem = lists[1]
		const remove = vi.fn()
		const listActions = createDefaultActions({
			remove,
		})

		mountComponent({ lists, activeListId: '1', listActions })

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
		const listActions = createDefaultActions({
			create,
		})
		const listName = getTestListName()

		mountComponent({ listActions })

		const input = screen.getByLabelText(/list name/i)
		await userEvent.type(input, listName)

		const submitButton = screen.getByLabelText(/submit/i)
		await userEvent.click(submitButton)

		expect(create).toHaveBeenCalledWith(listName)
	})

	it('validates input', async () => {
		const create = vi.fn()
		const listActions = createDefaultActions({
			create,
		})

		mountComponent({ listActions })

		const submitButton = screen.getByLabelText(/list name/i)
		await userEvent.click(submitButton)

		expect(create).not.toHaveBeenCalled()
	})
})
