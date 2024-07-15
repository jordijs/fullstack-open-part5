const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const { initialBlogs, blogsInDb } = require('./blogs_api_helper')

const api = supertest(app)

describe('when there are initially some blogs saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    for (let blog of initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  test('existing number of blogs are returned as json', async () => {

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)

  })

  test('identifier is named "id"', async () => {
    const response = await api
      .get('/api/blogs')

    for (const object of response.body) {
      assert.strictEqual('id' in object, true)
    }

  })

  describe('adding a new blog', () => {

    test('suceeds with valid data', async () => {

      const newBlog = {
        title: 'Full stack open development',
        author: 'Arto Hellas',
        url: 'https://blogwebsite.com',
        likes: 3
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const currentBlogs = await blogsInDb()
      assert.strictEqual(initialBlogs.length + 1, currentBlogs.length)

      const titles = currentBlogs.map(blog => blog.title)
      assert(titles.includes(newBlog.title))

    })

    test('if "likes" is missing from request, default to 0', async () => {

      const newBlog = {
        title: 'Development without likes',
        author: 'Mary Poppendieck',
        url: 'https://unlikedblog.com'
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('if "title" is missing from request, return 400', async () => {

      const newBlog = {
        author: 'Arto Hellas',
        url: 'https://untitledblog.com',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    })

    test('if "url" is missing from request, return 400', async () => {

      const newBlog = {
        title: 'Anonymous blog post',
        url: 'https://anonymousblog.com',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    })

    test('if "url" and "title" are missing from request, return 400', async () => {

      const newBlog = {
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    })

  })

  describe('deleting a blog', () => {
    test('succeeds with code 204 if id is valid', async () => {

    })
  })

  after(async () => {
    await mongoose.connection.close()
  })

})
