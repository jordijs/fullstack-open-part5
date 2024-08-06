import { useState } from 'react'

const Blog = ({ blog }) => {

  const [expanded, setExpanded] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

console.log(blog)
  if (!expanded) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={() => setExpanded(true)}>view</button>
      </div>
    )
  } else {
    return (
      <div style={blogStyle}>
        <div>{blog.title} {blog.author} <button onClick={() => setExpanded(false)}>hide</button></div>
        <div>{blog.url}</div>
        <div>likes {blog.likes}<button>like</button></div>
        <div>{blog.user.name}</div>
      </div>
    )
  }



}



export default Blog