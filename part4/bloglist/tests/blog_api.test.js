const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

// Create a test user and get a token before each test
let token
let testUser

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  testUser = new User({ username: 'testuser', name: 'Test User', passwordHash })
  await testUser.save()

  // Login to get token
  const response = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'sekret' })
  token = response.body.token

  // Insert initial blogs linked to testUser
  const blogs = helper.initialBlogs.map((b) => ({ ...b, user: testUser._id }))
  const savedBlogs = await Blog.insertMany(blogs)
  testUser.blogs = savedBlogs.map((b) => b._id)
  await testUser.save()
})

// Exercise 4.8
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

  // Exercise 4.9
  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

// Exercise 4.10-4.12, 4.23
describe('addition of a new blog', () => {
  // Exercise 4.10
  test('succeeds with valid data and token', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Test Author',
      url: 'https://test.com',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map((b) => b.title)
    assert.ok(titles.includes(newBlog.title))
  })

  // Exercise 4.11
  test('likes defaults to 0 if missing from request', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Test Author',
      url: 'https://test.com',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  // Exercise 4.12
  test('fails with status 400 if title is missing', async () => {
    const newBlog = { author: 'Test Author', url: 'https://test.com', likes: 1 }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status 400 if url is missing', async () => {
    const newBlog = { title: 'Missing URL blog', author: 'Test Author', likes: 1 }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  // Exercise 4.23
  test('fails with status 401 if token is missing', async () => {
    const newBlog = {
      title: 'No token blog',
      author: 'Test Author',
      url: 'https://test.com',
    }

    await api.post('/api/blogs').send(newBlog).expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

// Exercise 4.16: user creation validation
describe('user creation', () => {
  test('succeeds with valid data', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = { username: 'newuser', name: 'New User', password: 'password123' }
    await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    const usernames = usersAtEnd.map((u) => u.username)
    assert.ok(usernames.includes(newUser.username))
  })

  test('fails with status 400 if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const duplicate = { username: 'testuser', name: 'Another', password: 'password123' }
    const result = await api.post('/api/users').send(duplicate).expect(400)
    assert.ok(result.body.error.includes('unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with status 400 if username is too short', async () => {
    const newUser = { username: 'ab', name: 'Short', password: 'password123' }
    const result = await api.post('/api/users').send(newUser).expect(400)
    assert.ok(result.body.error)
  })

  test('fails with status 400 if password is too short', async () => {
    const newUser = { username: 'validuser', name: 'Valid', password: 'ab' }
    const result = await api.post('/api/users').send(newUser).expect(400)
    assert.ok(result.body.error)
  })
})

after(async () => {
  await mongoose.connection.close()
})
