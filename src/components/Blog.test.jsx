import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { beforeEach } from 'vitest'

describe('<Blog />', () => {

  let container

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

  beforeEach(() => {
    container = render(<Blog blog={blog} user={user} />).container
  })

  test('renders title and author, not url or likes', () => {

    const blogContainer = container.querySelector('.blog')
    expect(blogContainer).toHaveTextContent(
      'John Doe'
    )
    expect(blogContainer).toHaveTextContent(
      'Dummy Title'
    )

    const blogDetails = container.querySelector('.blogDetails')
    expect(blogDetails).toHaveTextContent('https://www.fakeblog.com')
    expect(blogDetails).toHaveTextContent('likes 5')
    expect(blogDetails).toHaveStyle('display:none')

  })

  test('url and likes are shown on button click', () => {

    // const blogContainer = container.querySelector('.blog')
    // expect(blogContainer).toHaveTextContent(
    //   'John Doe'
    // )
    // expect(blogContainer).toHaveTextContent(
    //   'Dummy Title'
    // )

    // const blogDetails = container.querySelector('.blogDetails')
    // expect(blogDetails).toHaveTextContent('https://www.fakeblog.com')
    // expect(blogDetails).toHaveTextContent('likes 5')
    // expect(blogDetails).toHaveStyle('display:none')

  })

})