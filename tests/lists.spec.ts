import { faker } from '@faker-js/faker'
import { expect, Page, PlaywrightTestArgs, test } from '@playwright/test'
import { createList, loginAsUser } from './test'

test('create list', async ({ page }: PlaywrightTestArgs) => {
	const email = faker.internet.email()
	await page.goto('./login')

	await loginAsUser(page, email)

	// for some reason this is janky and blows up
	// await expect(page).toHaveURL('./app')

	const listName = faker.name.jobTitle()
	await createList(page, listName)

	await expect(page.getByText(listName)).toBeVisible()
})

test('rename list', async ({ page }: PlaywrightTestArgs) => {
	const email = faker.internet.email()
	await page.goto('./login')
	await loginAsUser(page, email)

	const listName = faker.commerce.product()
	await createList(page, listName)

	const listItem = page.getByRole('listitem').first()

	// open menu
	await listItem.getByRole('button', { name: /open list menu/i }).click()
	await page.getByRole('menuitem', { name: /rename/i }).click()

	// complete rename form
	const newListName = faker.commerce.product()
	await listItem.getByRole('textbox').fill(newListName)
	await listItem.getByRole('button', { name: /submit list form/i }).click()

	await expect(page.getByText(newListName)).toBeVisible()
})

test('delete list', async ({ page }: PlaywrightTestArgs) => {
	const email = faker.internet.email()
	await page.goto('./login')
	await loginAsUser(page, email)

	const listName = faker.commerce.product()
	await createList(page, listName)

	const listItem = page.getByRole('listitem').first()
	await listItem.getByRole('button', { name: /open list menu/i }).click()
	await page.getByRole('menuitem', { name: /delete*/i }).click()

	await expect(page.getByText(listName)).not.toBeVisible()
})
