import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from "./components/Notification";

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
  const [notification, setNotification] = useState(null)

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
      displayNotification('error', 'wrong username or password')
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
      setBlogs(blogs.concat(blog))
      displayNotification('success', `a new blog ${blog.title} by ${blog.author} added`)
    } catch (exception) {
      displayNotification('error', exception.response.data.error)
    }
  }

  const displayNotification = (type, message) => {
    setNotification(
      { type, message }
    )
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  if (user === null) {
    return (
      <LoginForm
        handleLogin={handleLogin}
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        notification={notification}
      />
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
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