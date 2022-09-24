// for some reason typings for cypress testing library aren't working
import AuthForm, { AuthFormProps } from './AuthForm'

describe('<ColorSchemePicker />', () => {
  const mountComponent = (props: Partial<AuthFormProps> = {}) => {
    let {
      submit = cy.spy(),
      type = 'login',
      navigateToOtherType = cy.spy(),
      loading = false,
    } = props

    cy.mount(
      <AuthForm
        submit={submit}
        type={type}
        navigateToOtherType={navigateToOtherType}
        loading={loading}
      />,
    )
  }

  it('renders login form', () => {
    mountComponent()

    cy.findByRole('button', { name: /login/i })
  })

  it('renders registration form', () => {
    mountComponent({ type: 'register' })

    cy.findByRole('button', { name: /register/i })
  })

  it('should submit successfully', () => {
    const submit = cy.spy().as('submitSpy')
    mountComponent({ submit })

    const inputs = {
      email: 'email@domain.com',
      password: 'password',
    }

    cy.get('body').find('input[name="email"]').type(inputs.email)
    cy.get('body').find('input[name="password"]').type(inputs.password)
    cy.findByRole('button', { name: /login/i }).click()

    cy.get('@submitSpy').should('have.been.calledWith', inputs)
  })

  it('disables the submit button when loading', () => {
    mountComponent({ loading: true })

    cy.findByRole('button', { name: /login/i }).should('be.disabled')
  })

  it('validates the inputs', () => {
    const submitSpy = cy.spy().as('submitSpy')
    mountComponent({ submit: submitSpy })

    cy.findByRole('button', { name: /login/i }).click()

    cy.get('@submitSpy').should('not.have.been.called')
  })

  it('natigates to other auth type when link is clicked', () => {
    const navigateToOtherType = cy.spy().as('navigateSpy')
    mountComponent({ navigateToOtherType })

    cy.findByTestId('AuthForm-navigate').click()

    cy.get('@navigateSpy').should('have.been.called')
  })

  it('show error message when one is returned', () => {
    const submit = cy.stub().returns('error')
    mountComponent({ submit })

    cy.get('body').find('input[name="email"]').type('email@domain.com')
    cy.get('body').find('input[name="password"]').type('password')
    cy.findByRole('button', { name: /login/i }).click()

    cy.findByText(/error/i).should('exist')
  })
})
