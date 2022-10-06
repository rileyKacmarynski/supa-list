import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '__tests__/testUtils'
import Header, { HeaderProps } from './Header'

describe('<Header />', () => {
	const mountComponent = (props: Partial<HeaderProps> = {}) => {
		const {
			menuOpened = false,
			toggleMenu = vi.fn(),
			children = 'header content',
		} = props

		return renderWithProviders(
			<Header menuOpened={menuOpened} toggleMenu={toggleMenu}>
				{children}
			</Header>,
		)
	}

	const openSettingsMenu = async () => {
		await userEvent.click(screen.getByLabelText(/open settings/i))
	}

	const closeSettingsMenu = async () => {
		await userEvent.keyboard('{Escape}')
	}

	it('displays the header content', () => {
		const headerText = 'header text'
		mountComponent({ children: headerText })

		expect(screen.queryByText(headerText)).toBeInTheDocument()
	})

	it('opens and closes the settings menu', async () => {
		mountComponent()

		openSettingsMenu()

		closeSettingsMenu()

		await waitFor(() =>
			expect(screen.queryByText('Settings')).not.toBeInTheDocument(),
		)
	})
})
