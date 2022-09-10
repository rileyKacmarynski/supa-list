import Layout from './Layout'

describe('<Layout />', () => {
  const mountLayout = () => {
    cy.mount(
      <Layout navbar="navbar" header="header">
        I am layout
      </Layout>,
    )
  }

  it('mounts', () => {
    mountLayout()
  })

  it('opens settings menu', () => {
    mountLayout()

    cy.get('[aria-label="open settings"]').click()

    cy.contains(/settings/i)
  })
})
