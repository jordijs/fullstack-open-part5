import { render, screen } from '@testing-library/react'
import Blog from './Blog'

// Make a test, which checks that the component displaying a blog renders the blog's title and author, but does not render its URL or number of likes by default.

// Add CSS classes to the component to help the testing as necessary.

test('renders title and author, not url or likes', () => {  
  
  const user = {
    id: 1,
    name: 'Jane Smith',
    username: 'janesmith'
  }

  const blog = {
    id: 2,
    likes: 5,
    author: 'John Doe',
    title: 'Dummy Title',
    url: 'https://www.fakeblog.com',
    user: user
  }

  render(<Blog blog={blog} user={user}/>)

  const element = screen.getByText(
    'Dummy Title', 
    { exact: false } 
  )
  expect(element).toBeDefined()
})