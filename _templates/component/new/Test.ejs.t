---
to: <%= path %>/<%= Name %>/<%= Name %>.spec.tsx
---
import { screen, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import <%= Name %>, { <%= Name %>Props } from './<%= Name %>'

describe('<<%= Name %> />', () => {
  // you could make this a partial and add default values like this
  // const mountComponent = (props: Partial<UserMenuProps> = {}) => {
  // const { user = createDefaultUser(), signOut = vi.fn() } = props

  // return renderWithProviders(<UserMenu user={user} signOut={signOut} />)
  // }
  const mountComponent = (props: <%= Name %>Props) => {

    return render(<<%= Name %> {...props} />)
  }

  it('renders', () => {
    mountComponent({})

    expect(screen.queryByText('<%= Name %>')).toBeInTheDocument()
  })
})
