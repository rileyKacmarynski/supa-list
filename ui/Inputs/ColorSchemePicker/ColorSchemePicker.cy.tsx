// @ts-nocheck
// for some reason typings for cypress testing library aren't working
import ColorSchemePicker, { ColorSchemePickerProps } from './ColorSchemePicker'

describe('<ColorSchemePicker />', () => {
  const mountComponent = (props: Partial<ColorSchemePickerProps> = {}) => {
    let { primaryColorOption, setPrimaryColor } = props

    if (!primaryColorOption) primaryColorOption = 'grape'
    if (!setPrimaryColor) setPrimaryColor = cy.spy()

    cy.mount(
      <ColorSchemePicker
        primaryColorOption={primaryColorOption}
        setPrimaryColor={setPrimaryColor}
      />,
    )
  }

  it('makes call to set primary color', () => {
    const setPrimaryColor = cy.spy().as('setPrimaryColorSpy')

    mountComponent({ setPrimaryColor })

    cy.get('body')
      .findByRole('button', { name: /change theme to indigo/i })
      .should('exist')
      .click()

    cy.get('@setPrimaryColorSpy').should('have.been.calledWith', 'indigo')
  })

  it('checks the passed in color option', () => {
    const primaryColorOption = 'teal'
    mountComponent({ primaryColorOption })

    cy.get('body')
      .findByRole('button', { name: /change theme to teal/i })
      .within(() => {
        cy.findByTestId('primary-color-check').should('exist')
      })
  })
})
