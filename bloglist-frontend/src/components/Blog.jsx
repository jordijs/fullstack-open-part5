import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, likeBlog, removeBlog, user }) => {

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

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author} <button onClick={handleExpand}>{label}</button>
      <div style={showWhenVisible} className='blogDetails'>
        <div>{blog.url}</div>
        <div>likes {blog.likes}<button onClick={() => likeBlog(blog)}>like</button></div>
        <div>{blog.user.name}</div>
        {user.username === blog.user.username && removeButton()}
      </div>
    </div>
  )

}

export default Blog