import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
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

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const blog = await blogService.create(blogObject)
      setBlogs(blogs.concat(blog))
      displayNotification('success', `a new blog ${blog.title} by ${blog.author} added`)
    } catch (exception) {
      displayNotification('error', exception.response.data.error)
    }
  }

  const likeBlog = async (blog) => {
    try {
      const updatedBlog = await blogService.update({
        ...blog,
        likes: blog.likes + 1
      })
      if (updatedBlog) {
        const updatedBlogs = blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog)
        const sortedBlogs = updatedBlogs.toSorted((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      }
    } catch (exception) {
      console.error(exception)
    }
  }

  const removeBlog = blogId => {
    const updatedBlogs = blogs.filter(blog => blog.id !== blogId)
    setBlogs(updatedBlogs)
  }

  const displayNotification = (type, message) => {
    setNotification(
      { type, message }
    )
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const blogFormRef = useRef()

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
      <Togglable
        buttonLabel='new blog'
        ref={blogFormRef}
      >
        <BlogForm
          addBlog={addBlog}
        />
      </Togglable>
      <div data-testid='bloglist'>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} user={user} />
        )}
      </div>

    </div>
  )
}

export default App