const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
      await loginWith(page, 'jordijs', 'contrasenya')

      await expect(page.getByText('Jordi Julià logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'jordijs', 'wrong')

      const error = await page.getByText('wrong username or password')
      await expect(error).toBeVisible()
      await expect(error).toHaveCSS('border-style', 'solid')
      await expect(error).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Jordi Julià logged in')).not.toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'jordijs', 'contrasenya')
      })

      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'Adding blogs with testing', 'Jane Smith', 'http://www.testblog.com')

        await expect(page.getByTestId('bloglist')).toContainText('Adding blogs with testing Jane Smith')
      })

      describe('and one blog exists', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'Adding blogs with testing', 'Jane Smith', 'http://www.testblog.com')
        })

        test('importance can be changed', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()
          await page.getByRole('button', { name: 'like' }).click()
          await expect(page.getByText('likes 1')).toBeVisible()
        })
      })
    })

  })
})