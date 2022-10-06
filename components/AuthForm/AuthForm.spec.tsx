import { faker } from '@faker-js/faker'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '__tests__/testUtils'
import AuthForm, { AuthFormProps } from './AuthForm'

describe('<AuthForm />', () => {
	const mountComponent = (props: Partial<AuthFormProps> = {}) => {
		const {
			loading = false,
			navigateToOtherType = vi.fn(),
			submit = vi.fn(),
			type = 'login',
		} = props

		return renderWithProviders(
			<AuthForm
				loading={loading}
				navigateToOtherType={navigateToOtherType}
				submit={submit}
				type={type}
			/>,
		)
	}

	const getEmailInput = () => screen.getByLabelText(/email/i)

	const getPasswordInput = () => screen.getByLabelText(/password/i)

	it('shows login', () => {
		mountComponent({ type: 'login' })

		expect(screen.queryByRole('button', { name: /login/i })).toBeDefined()
	})

	it('shows register', () => {
		mountComponent({ type: 'register' })

		expect(screen.queryByRole('button', { name: /register/i })).not.toBeNull()
	})

	it('allows you to navigate from login to register', async () => {
		const navigateToOtherType = vi.fn()
		mountComponent({ navigateToOtherType })

		await userEvent.click(screen.getByTestId('AuthForm-navigate'))

		expect(navigateToOtherType).toHaveBeenCalled()
	})

	it('disables the submit button when loading', () => {
		mountComponent({ loading: true })

		expect(screen.getByRole('button', { name: /login/i })).toHaveProperty(
			'disabled',
			true,
		)
	})

	const fillOutForm = async (credentials: {
		email: string
		password: string
	}) => {
		await userEvent.type(getEmailInput(), credentials.email)
		await userEvent.tab()
		await userEvent.keyboard(credentials.password)
	}

	it('submits when valid data is entered', async () => {
		const submit = vi.fn()
		const credentials = {
			email: faker.internet.email(),
			password: faker.internet.password(),
		}

		mountComponent({ submit })

		await fillOutForm(credentials)

		await userEvent.keyboard('{Enter}')

		expect(submit).toHaveBeenCalledWith(credentials)
	})

	it('shows error message if submission fails', async () => {
		const submit = vi.fn()
		const error = 'something went wrong'
		submit.mockResolvedValue(error)
		const credentials = {
			email: faker.internet.email(),
			password: faker.internet.password(),
		}

		mountComponent({ submit })

		await fillOutForm(credentials)
		await userEvent.keyboard('{Enter}')

		expect(screen.queryByText(error)).toBeDefined()
	})

	it('does not submit if inputs are empty', async () => {
		const submit = vi.fn()
		mountComponent({ submit, type: 'login' })

		await userEvent.click(screen.getByRole('button', { name: /login/i }))

		expect(submit).not.toHaveBeenCalled()
	})
})
