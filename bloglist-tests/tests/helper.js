const loginWith = async (page, username, password)  => {
  await page.getByRole('textbox', { name: 'username' }).fill(username)
  await page.getByRole('textbox', { name: 'password' }).fill(password)
  await page.getByRole('button', { name: /login/i }).click()
}

export { loginWith }