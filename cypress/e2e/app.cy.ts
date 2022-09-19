/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

describe('App', () => {
  it('should render the app page', () => {
    // Start from the index page
    cy.visit('')

    // Find a link with an href attribute containing "about" and click it
    // cy.get('a[href*="about"]').click()

    // // The new url should include "/about"
    // cy.url().should('include', '/about')

    // The new page should contain an h1 with "About page"
    cy.contains(/log in/i)
  })
})

// Prevent TypeScript from reading file as legacy script
export {}
