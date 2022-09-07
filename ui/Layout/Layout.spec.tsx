import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../__tests__/testUtils'
import { screen } from '@testing-library/react'
import Layout from './Layout'

describe('<Layout />', () => {
  const renderComponent = () => {
    renderWithProviders(
      <Layout navbar={<div>nav</div>} header={<div>header</div>}>
        <div>this is a layout</div>
      </Layout>,
    )
  }

  it('renders', () => {
    renderComponent()

    expect(screen.findByText(/this is a layout/i)).toBeDefined()
  })
})
