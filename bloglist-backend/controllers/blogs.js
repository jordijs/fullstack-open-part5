const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1
    })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    user: user._id,
    likes: body.likes
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  const blogWithUser = await savedBlog.populate('user', {
    username: 1,
    name: 1
  })
  response.status(201).json(blogWithUser)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const tokenUser = request.user._id.toString()
  const blog = await Blog.findById(request.params.id)
  if (!blog){
    response.status(404).json({ error: 'Blog not found' })
  }
  const blogUser = blog.user.toString()

  if (blogUser === tokenUser) {
    const deleted = await Blog.findByIdAndDelete(request.params.id)
    if (deleted) {
      response.status(204).end()
    }
  } else {
    response.status(401).json({ error: 'this note does not belong to your user' })
  }
})

blogsRouter.put('/:id', async (request, response) => {

  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

  if (updatedBlog){
    const blogWithUser = await updatedBlog.populate('user', {
      username: 1,
      name: 1
    })
    response.json(blogWithUser).end()
  } else {
    response.status(404).json({ error: 'Blog not found' })
  }

})

module.exports = blogsRouter