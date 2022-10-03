import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '__tests__/testUtils'
import UserMenu, { UserMenuProps } from './UserMenu'
import { User } from 'lib/auth'

describe('<UserMenu />', () => {
  const mountComponent = (props: Partial<UserMenuProps> = {}) => {
    const { user = createDefaultUser(), signOut = vi.fn() } = props

    return renderWithProviders(<UserMenu user={user} signOut={signOut} />)
  }

  const createDefaultUser: () => User = () => ({
    aud: 'aud',
    email: 'email',
    created_at: new Date().toUTCString(),
    id: '123',
    app_metadata: {},
  })

  afterEach(cleanup)

  it('shows users email', () => {
    const email = 'email@domain.com'
    const user = {
      ...createDefaultUser(),
      email,
    }

    mountComponent({ user })

    expect(screen.queryByText(email)).toBeDefined()
  })

  it('signs the user out', async () => {
    const signOut = vi.fn()
    mountComponent({ signOut })

    await userEvent.click(screen.getByLabelText(/open user menu/i))
    await userEvent.click(screen.getByText(/log out/i))

    expect(signOut).toHaveBeenCalled()
  })
})
