import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  afterEach(cleanup)

  it('displays the header content', () => {
    const headerText = 'header text'
    mountComponent({ children: headerText })

    expect(screen.queryByText(headerText)).toBeDefined()
  })

  it('opens and closes the settings menu', async () => {
    mountComponent()

    openSettingsMenu()

    closeSettingsMenu()

    await waitFor(() => expect(screen.queryByText('Settings')).toBeNull())
  })
})
