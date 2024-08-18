const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const formTitle = await page.getByText('Log in to application')
    const username = await page.getByRole('textbox', { name: 'username'} )
    const password = await page.getByRole('textbox', { name: 'password'} )
    const loginButton = await page.getByRole('button', { name: /login/i })

    await expect(formTitle).toBeVisible()
    await expect(username).toBeVisible()
    await expect(password).toBeVisible()
    await expect(loginButton).toBeVisible()
  })
})