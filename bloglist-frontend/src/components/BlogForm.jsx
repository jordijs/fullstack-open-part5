
import { useState } from 'react'

const BlogForm = ({ addBlog }) => {

  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const handleForm = (event) => {
    event.preventDefault()
    addBlog(newBlog)
    setNewBlog({
      title: '',
      author: '',
      url: ''
    })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleForm}>
        <div>
          <label>
            title:
            <input
              type="text"
              value={newBlog.title}
              name="Title"
              placeholder='write blog title here'
              onChange={({ target }) => setNewBlog({
                ...newBlog,
                title: target.value
              })}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              value={newBlog.author}
              name="Author"
              placeholder='write blog author here'
              onChange={({ target }) => setNewBlog({
                ...newBlog,
                author: target.value
              })}

            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="text"
              value={newBlog.url}
              name="Url"
              placeholder='write blog url here'
              onChange={({ target }) => setNewBlog({
                ...newBlog,
                url: target.value
              })}
            />
          </label>

        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm