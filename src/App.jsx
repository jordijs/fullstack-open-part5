import { useState, useEffect } from 'react'
import Blog from './components/Blog'
// import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error(exception)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(
      'loggedBloglistUser', JSON.stringify(user)
    )
    setUser(null)
  }

  const handleBlogForm = async (event) => {
    event.preventDefault()
    try {
      const blog = await blogService.create(newBlog)
      setNewBlog({
        title: '',
        author: '',
        url: ''
      })
      console.log(blog)
      // setBlogs({...blogs, newBlog})
    } catch (exception) {
      console.error(exception)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              autoComplete="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              autoComplete="current-password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>
      <div>
        <h2>create new</h2>
        <form onSubmit={handleBlogForm}>
          <div>
            title:
            <input
              type="text"
              value={newBlog.title}
              name="Title"
              onChange={({ target }) => setNewBlog({
                ...newBlog,
                title: target.value
              })}
            />
          </div>
          <div>
            author:
            <input
              type="text"
              value={newBlog.author}
              name="Author"
              onChange={({ target }) => setNewBlog({
                ...newBlog,
                author: target.value
              })}
            />
          </div>
          <div>
            url:
            <input
              type="text"
              value={newBlog.url}
              name="Url"
              onChange={({ target }) => setNewBlog({
                ...newBlog,
                url: target.value
              })}
            />
          </div>
          <button type="submit">create</button>
        </form>
      </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App