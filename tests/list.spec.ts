import { faker } from '@faker-js/faker'
import { expect, Page, PlaywrightTestArgs, test } from '@playwright/test'
import { loginAsUser, createList } from './test'

test('shows active list', async ({ page }: PlaywrightTestArgs) => {
	const email = faker.internet.email()
	await page.goto('./login')

	await loginAsUser(page, email)

	const listName = faker.company.name()
	await createList(page, listName)

	await expect(page.getByTestId('todos').getByText(listName)).toBeVisible()
})
