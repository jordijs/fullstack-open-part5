const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const firstUser = await User.findOne({})
  const newBlog = { ...request.body, user: firstUser._id }
  const blog = new Blog(newBlog)
  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const deleted = await Blog.findByIdAndDelete(request.params.id)
  if (deleted) {
    response.status(204).end()
  } else {
    response.status(404).json({ error: 'Blog not found' })
  }
})

blogsRouter.put('/:id', async (request, response) => {

  if (!request.body.likes) {
    response.status(400).json({ error: 'New likes must be sent in the request' })
  }

  const newData = {
    likes: request.body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newData, { new: true })
  if (updatedBlog){
    response.json(updatedBlog).end()
  } else {
    response.status(404).json({ error: 'Blog not found' })
  }

})

module.exports = blogsRouter