import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {

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

  const handleLike = () => {
    blogService.update({ 
      ...blog, 
      likes: blog.likes + 1 
    })
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={handleExpand}>{label}</button>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>likes {blog.likes}<button onClick={handleLike}>like</button></div>
        <div>{blog.user.name}</div>
      </div>
    </div>
  )

}

export default Blog