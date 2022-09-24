/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress
import { faker } from '@faker-js/faker'

describe('Auth', () => {
  it('should allow a user to register', () => {
    const form = {
      email: faker.internet.email(undefined, undefined, 'example.com'),
      password: faker.internet.password(),
    }

    cy.visit('')

    cy.get('a[href*="register"]').click()

    cy.get('input[name="email"]').type(form.email)
    cy.get('input[name="password"]').type(form.password)
    cy.get('button[type="submit"]').click()

    cy.findByText(form.email)
  })

  it('should allow a user to log in', () => {
    const form = {
      email: faker.internet.email(undefined, undefined, 'example.com'),
      password: faker.internet.password(),
    }

    cy.visit('/login')

    cy.get('input[name="email"]').type(form.email)
    cy.get('input[name="password"]').type(form.password)
    cy.get('button[type="submit"]').click()

    cy.findByText(form.email)
  })
})

// Prevent TypeScript from reading file as legacy script
export {}
