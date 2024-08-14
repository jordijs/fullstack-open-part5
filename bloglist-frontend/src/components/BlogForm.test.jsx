import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls event handler with correct data', async () => {

  const addBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm addBlog={addBlog} />)

  const inputTitle = screen.getByPlaceholderText('write blog title here')
  const inputAuthor = screen.getByPlaceholderText('write blog author here')
  const inputUrl = screen.getByPlaceholderText('write blog url here')

  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'Placeholder Blog Post')
  await user.type(inputAuthor, 'Jane Doe')
  await user.type(inputUrl, 'http://www.fakeblogpost.com')

  await user.click(sendButton)

  expect(addBlog.mock.calls).toHaveLength(1)

  expect(addBlog.mock.calls[0][0].title).toBe('Placeholder Blog Post')
  expect(addBlog.mock.calls[0][0].author).toBe('Jane Doe')
  expect(addBlog.mock.calls[0][0].url).toBe('http://www.fakeblogpost.com')

})

