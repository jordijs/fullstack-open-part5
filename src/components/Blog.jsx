import { useState } from 'react'

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

  const handleButton = () => {
    expanded ? setLabel('view') : setLabel('hide')
    setExpanded(!expanded)
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={handleButton}>{label}</button>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>likes {blog.likes}<button>like</button></div>
        <div>{blog.user.name}</div>
      </div>
    </div>
  )

}

export default Blog