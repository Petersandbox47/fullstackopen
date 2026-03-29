const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

// Exercise 4.8: correct number of blogs returned as JSON
describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  // Exercise 4.9: unique identifier is named id
  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

// Exercise 4.10-4.12: adding new blogs
describe('addition of a new blog', () => {
  // Exercise 4.10: POST creates a new blog
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Test Author',
      url: 'https://test.com',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((b) => b.title)
    assert.ok(titles.includes(newBlog.title))
  })

  // Exercise 4.11: missing likes defaults to 0
  test('likes defaults to 0 if missing from request', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Test Author',
      url: 'https://test.com',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  // Exercise 4.12: missing title or url returns 400
  test('fails with status 400 if title is missing', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'https://test.com',
      likes: 1,
    }

    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status 400 if url is missing', async () => {
    const newBlog = {
      title: 'Missing URL blog',
      author: 'Test Author',
      likes: 1,
    }

    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
