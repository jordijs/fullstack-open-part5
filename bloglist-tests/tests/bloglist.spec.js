const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Jordi Julià',
        username: 'jordijs',
        password: 'contrasenya'
      }
    })
    await page.goto('/')
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

        test('the blog can be liked', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()
          await expect(page.getByText('likes 0')).toBeVisible()

          await page.getByRole('button', { name: 'like' }).click()
          await expect(page.getByText('likes 1')).toBeVisible()
        })

        test('blog can be deleted', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()

          page.on('dialog', dialog => dialog.accept())
          await page.getByRole('button', { name: 'remove' }).click()

          await expect(page.getByTestId('bloglist')).not.toContainText('Adding blogs with testing Jane Smith')
        })

        describe('and there are blogs by different users', () => {
          beforeEach(async ({ page, request }) => {
            await request.post('/api/users', {
              data: {
                name: 'John Doe',
                username: 'jdoe',
                password: 'secret'
              }
            })
            await page.getByRole('button', { name: 'logout' }).click()
            await loginWith(page, 'jdoe', 'secret')
            await createBlog(page, 'The second blog', 'Arto Hellas', 'http://www.secondblog.com')
            await createBlog(page, 'The third blog', 'Mary Poppendieck', 'http://www.thirdblog.com')
          })

          test('only the user who created the blog sees the delete button', async ({ page }) => {
            const firstNote = await page.getByText('Adding blogs with testing Jane Smith')
            await firstNote.getByRole('button', { name: 'view' }).click()
            await expect(firstNote.getByRole('button', { name: 'remove' })).not.toBeVisible()

            const secondNote = await page.getByText('The second blog Arto Hellas')
            await secondNote.getByRole('button', { name: 'view' }).click()
            await expect(secondNote.getByRole('button', { name: 'remove' })).toBeVisible()

            const thirdNote = await page.getByText('The third blog Mary Poppendieck')
            await thirdNote.getByRole('button', { name: 'view' }).click()
            await expect(thirdNote.getByRole('button', { name: 'remove' })).toBeVisible()
          })

          test('blogs are arranged according to number of likes', async ({ page }) => {
            
            const bloglist = await page.getByTestId('bloglist')
            await expect(bloglist.locator('.blog').first()).toContainText('Adding blogs with testing Jane Smith')
            await expect(bloglist.locator('.blog').nth(1)).toContainText('The second blog Arto Hellas')
            await expect(bloglist.locator('.blog').nth(2)).toContainText('The third blog Mary Poppendieck')

            const secondBlog = await page.getByText('The second blog Arto Hellas')
            await secondBlog.getByRole('button', { name: 'view' }).click()
            await secondBlog.getByRole('button', { name: 'like' }).click()
            await secondBlog.getByRole('button', { name: 'like' }).click()

            const thirdBlog = await page.getByText('The third blog Mary Poppendieck')
            await thirdBlog.getByRole('button', { name: 'view' }).click()
            await thirdBlog.getByRole('button', { name: 'like' }).click()

            await expect(bloglist.locator('.blog').first()).toContainText('The second blog Arto Hellas')
            await expect(bloglist.locator('.blog').nth(1)).toContainText('The third blog Mary Poppendieck')
            await expect(bloglist.locator('.blog').nth(2)).toContainText('Adding blogs with testing Jane Smith')

          })

        })
      })
    })
  })
})