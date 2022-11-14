import { screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DeepPartial, renderWithProviders } from '__tests__/testUtils'
import Lists, { ListActions, ListsProps } from './Lists'
import { makeTestList } from './listTestUtils'

describe('<Lists />', () => {
	const defaultList = makeTestList(5)

	const createDefaultActions = (actions: Partial<ListActions>) => {
		return {
			deleteItem: vi.fn(),
			renameItem: vi.fn(),
			setActive: vi.fn(),
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

		expect(screen.queryByText(/no lists/i)).toBeInTheDocument()
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
})
