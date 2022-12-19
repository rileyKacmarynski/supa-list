import { expect, Page, test } from '@playwright/test'

// can customize base test here

export async function loginAsUser(page: Page, username: string) {
	await page.locator('text=Log In').click()
	await expect(page).toHaveURL('./login')

	const emailInput = page.locator('text=email')
	await emailInput.click()
	await emailInput.fill(username)

	const passwordInput = page.locator('text=password')
	await passwordInput.click()
	await passwordInput.fill('Password123')

	await page.locator('button:has-text("Login")').click()
}

export async function createList(page: Page, name: string) {
	await page.getByPlaceholder('create a list').fill(name)

	await page.getByRole('button', { name: /submit list form/i }).click()
}

export { test, expect }
