const Blog = require('../../models/blog')
const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {

  const blogCreation = await blogWithUser()

  const { savedBlog: blog, token } = blogCreation

  await blog.deleteOne()

  return {
    blogId: blog._id.toString(),
    token
  }
}

const authenticatedUser = async ()  => {

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('contrasenya', 10)

  const user = new User({ username: 'jordijs', passwordHash })

  const savedUser = await user.save()

  const username = savedUser.username
  const id = savedUser._id
  const userForToken = { username, id }

  const token = jwt.sign(userForToken, process.env.SECRET)

  return { token, savedUser }
}

const blogWithUser = async () => {

  const userHelper = await authenticatedUser()
  const { savedUser: user, token } = userHelper

  const blog = new Blog ({
    title: 'Full stack open development',
    author: 'Arto Hellas',
    url: 'https://blogwebsite.com',
    likes: 3,
    user: user._id,
  })

  const savedBlog = await blog.save()

  return { token, savedBlog }
}

module.exports = {
  initialBlogs, blogsInDb, nonExistingId, authenticatedUser, blogWithUser
}