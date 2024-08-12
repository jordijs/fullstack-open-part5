import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlogs, removeBlog, user }) => {

  const [expanded, setExpanded] = useState(false)
  const [label, setLabel] = useState('view')

  const showWhenVisible = { display: expanded ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleExpand = () => {
    expanded ? setLabel('view') : setLabel('hide')
    setExpanded(!expanded)
    console.log(user)
  }

  const handleLike = async () => {
    try {
      const updatedBlog = await blogService.update({
        ...blog,
        likes: blog.likes + 1
      })
      if (updatedBlog) {
        blog.likes = blog.likes + 1
        updateBlogs(updatedBlog)
      }
    } catch (exception) {
      console.error(exception)
    }
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        const removed = await blogService.remove(blog.id)
        if (removed) {
          console.log('removed ok', removed)
          removeBlog(blog.id)
        }
      } catch (exception) {
        console.error(exception)
      }
    }
  }

  const removeButton = () => {
    return (
      <button onClick={handleRemove}>remove</button>
    )
  }

  console.log(blog)

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author} <button onClick={handleExpand}>{label}</button>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>likes {blog.likes}<button onClick={handleLike}>like</button></div>
        <div>{blog.user.name}</div>
        {user.username === blog.user.username && removeButton()}
      </div>
    </div>
  )

}

export default Blog