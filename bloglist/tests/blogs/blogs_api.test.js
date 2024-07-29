const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../../app')
const Blog = require('../../models/blog')

const { initialBlogs, blogsInDb, nonExistingId, authenticatedUser, blogWithUser } = require('./blogs_api_helper')

const api = supertest(app)

describe('when there are initially some blogs saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
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

      const user = await authenticatedUser()
      const token = user.token

      const newBlog = {
        title: 'Full stack open development',
        author: 'Arto Hellas',
        url: 'https://blogwebsite.com',
        likes: 3
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const currentBlogs = await blogsInDb()
      assert.strictEqual(initialBlogs.length + 1, currentBlogs.length)

      const titles = currentBlogs.map(blog => blog.title)
      assert(titles.includes(newBlog.title))

    })

    test('if "likes" is missing from request, default to 0', async () => {

      const user = await authenticatedUser()
      const token = user.token

      const newBlog = {
        title: 'Development without likes',
        author: 'Mary Poppendieck',
        url: 'https://unlikedblog.com'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('if "title" is missing from request, return 400', async () => {

      const user = await authenticatedUser()
      const token = user.token

      const newBlog = {
        author: 'Arto Hellas',
        url: 'https://untitledblog.com',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

    })

    test('if "url" is missing from request, return 400', async () => {

      const user = await authenticatedUser()
      const token = user.token

      const newBlog = {
        title: 'Blog post without url',
        author: 'Arto Hellas',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

    })

    test('if "url" and "title" are missing from request, return 400', async () => {

      const user = await authenticatedUser()
      const token = user.token

      const newBlog = {
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

    })

  })

  describe('deleting a blog', () => {

    test('succeeds with code 204 if id is valid', async () => {

      const blogToDelete = await blogWithUser()
      const { savedBlog, token } = blogToDelete

      const blogsAtStart = await blogsInDb()

      await api
        .delete(`/api/blogs/${savedBlog._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      const ids = blogsAtEnd.map(blog => blog.id)
      assert(!ids.includes(savedBlog._id))

    })

    test('fails with code 404 if blog does not exist', async () => {

      const validNonExistingId = await nonExistingId()
      const { blogId, token } = validNonExistingId
      const blogsAtStart = await blogsInDb()

      await api
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)

      const blogsAtEnd = await blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)

    })

    test('fails with code 400 if blog id is not valid', async () => {

      const invalidId = '5a3d5da59070081a82a3445'
      const blogsAtStart = await blogsInDb()

      await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(400)

      const blogsAtEnd = await blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)

    })
  })

  describe('updating a blog', () => {
    test('succeeds with code 200 if id is valid', async () => {

      const blogsAtStart = await blogsInDb()
      const blogToEdit = blogsAtStart[0]
      const newData = {
        likes: 32
      }

      await api
        .put(`/api/blogs/${blogToEdit.id}`)
        .send(newData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()

      assert.strictEqual(blogsAtEnd[0].likes, newData.likes)

    })

    test('fails with code 404 if blog does not exist', async () => {

      const validNonExistingId = await nonExistingId()
      const newData = {
        likes: 73
      }

      await api
        .put(`/api/blogs/${validNonExistingId.blogId}`)
        .send(newData)
        .expect(404)

    })

    test('fails with code 400 if blog id is not valid', async () => {

      const invalidId = '5a3d5da59070081a82a3445'
      const newData = {
        likes: 99
      }

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(newData)
        .expect(400)

    })

    test('fails with code 400 if id is valid but likes are not sent', async () => {

      const blogsAtStart = await blogsInDb()
      const blogToEdit = blogsAtStart[0]
      const newData = {
        title: 'Can you change a title without sending likes?'
      }

      await api
        .put(`/api/blogs/${blogToEdit.id}`)
        .send(newData)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()

      assert.deepStrictEqual(blogsAtEnd[0], blogsAtStart[0])

    })

  })

  after(async () => {
    await mongoose.connection.close()
  })

})
