const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const { initialBlogs } = require('./blogs_api_helper')

const api = supertest(app)

describe('blogs api', () => {

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

  test('a POST request creates a blog post', async () => {

    const newBlog = {
      title: 'Full stack open development',
      author: 'Arto Hellas',
      url: 'https://blogwebsite.com',
      likes: 3
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    console.log(response.body)

  })

  after(async () => {
    await mongoose.connection.close()
  })

})
