import { expect, PlaywrightTestArgs } from '@playwright/test'
import { TOKEN_API } from 'mocks/handlers/auth'
import { rest } from 'msw'
import type { Page } from 'playwright-core'
import { test } from './test'

test('login', async ({ page }: PlaywrightTestArgs) => {
  const username = 'username'
  await page.goto('./app')

  await loginAsUser(page, username)

  await expect(page).toHaveURL('./app')
  await expect(page.locator('[aria-label="open user menu"]')).toContainText(
    username,
  )
})

test('register', async ({ page }) => {
  const username = 'username'
  await page.goto('./app')

  await page.locator('text=Register').click()
  await expect(page).toHaveURL('./register')

  const emailInput = page.locator('text=email')
  await emailInput.click()
  await emailInput.fill(username)

  const passwordInput = page.locator('text=password')
  await passwordInput.click()
  await passwordInput.fill('Password123')

  await page.locator('button:has-text("Register")').click()

  await expect(page).toHaveURL('./app')
  await expect(page.locator('[aria-label="open user menu"]')).toContainText(
    username,
  )
})

test('logout', async ({ page }) => {
  await page.goto('./app')

  const username = 'username'
  await loginAsUser(page, username)

  await page.locator('[aria-label="open user menu"]').click()
  await page.locator('button', { hasText: 'Log Out' }).click()

  await expect(page.locator('text=Log In')).toBeVisible()
  expect(await page.locator(`text=${username}`).count()).toEqual(0)
})

test.skip('login error', async ({ page, worker }) => {
  await worker.use(
    rest.post(TOKEN_API, async (_, response, context) => {
      response(context.status(403))
    }),
  )

  await page.goto('./login')
  await page.locator('button:has-text("Login")').click()
})

async function loginAsUser(page: Page, username: string) {
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
