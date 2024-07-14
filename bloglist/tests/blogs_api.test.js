const { test, after, beforeEach, describe,  } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

// const blogsHelper = require('../utils/blogs_helper')

const api = supertest(app)

describe('blogs api', () => {

  // beforeEach(async () => {
  //   await Note.deleteMany({})
  //   for (let note of helper.initialNotes) {
  //     let noteObject = new Note(note)
  //     await noteObject.save()
  //   }
  // })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })


  after(async () => {
    await mongoose.connection.close()
  })

})
