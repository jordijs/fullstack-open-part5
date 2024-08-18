const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Jordi Julià',
        username: 'jordijs',
        password: 'contrasenya'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'username' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'password' })).toBeVisible()
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox', { name: 'username' }).fill('jordijs')
      await page.getByRole('textbox', { name: 'password' }).fill('contrasenya')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText('Jordi Julià logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox', { name: 'username' }).fill('fake')
      await page.getByRole('textbox', { name: 'password' }).fill('wrong')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })
})