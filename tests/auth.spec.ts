import { faker } from '@faker-js/faker'
import { expect, Page, PlaywrightTestArgs, test } from '@playwright/test'
import { ERROR_USER } from 'mocks/handlers/auth'
import { loginAsUser } from './test'

test('login', async ({ page }: PlaywrightTestArgs) => {
	const email = faker.internet.email()
	await page.goto('./app')

	await loginAsUser(page, email)

	await expect(page).toHaveURL('./app')
	await expect(page.locator('[aria-label="open user menu"]')).toContainText(
		email,
	)
})

test('register', async ({ page }) => {
	const email = faker.internet.email()
	await page.goto('./app')

	await page.locator('text=Register').click()
	await expect(page).toHaveURL('./register')

	const emailInput = page.locator('text=email')
	await emailInput.click()
	await emailInput.fill(email)

	const passwordInput = page.locator('text=password')
	await passwordInput.click()
	await passwordInput.fill('Password123')

	await page.getByRole('button', { name: /register/i }).click()

	await expect(page).toHaveURL('./app')
	await expect(page.locator('[aria-label="open user menu"]')).toContainText(
		email,
	)
})

test('logout', async ({ page }) => {
	await page.goto('./app')

	const email = faker.internet.email()
	await loginAsUser(page, email)

	await page.locator('[aria-label="open user menu"]').click()
	await page.locator('button', { hasText: 'Log Out' }).click()

	await expect(page.locator('text=Log In')).toBeVisible()
	expect(await page.locator(`text=${email}`).count()).toEqual(0)
})

test('login error', async ({ page }) => {
	await page.goto('./app')

	await loginAsUser(page, ERROR_USER)

	await expect(page.locator(`[data-testid=AuthForm-errorText]`)).toBeVisible()
})
