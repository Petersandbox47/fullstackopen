const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

// Exercise 4.17: populate user info
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('user', { username: 1, name: 1 })
    if (blog) res.json(blog)
    else res.status(404).end()
  } catch (error) {
    next(error)
  }
})

// Exercise 4.19: require token; 4.22: use userExtractor middleware
blogsRouter.post('/', userExtractor, async (req, res, next) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ error: 'token invalid' })
    }

    const blog = new Blog({ ...req.body, user: user.id })
    const saved = await blog.save()

    user.blogs = user.blogs.concat(saved._id)
    await user.save()

    res.status(201).json(saved)
  } catch (error) {
    next(error)
  }
})

// Exercise 4.21: only creator can delete
blogsRouter.delete('/:id', userExtractor, async (req, res, next) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ error: 'token invalid' })
    }

    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).end()

    if (blog.user.toString() !== user.id.toString()) {
      return res.status(401).json({ error: 'only the creator can delete a blog' })
    }

    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/:id/comments', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).end()
    blog.comments = blog.comments.concat(req.body.comment)
    const saved = await blog.save()
    res.json(saved)
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (updated) res.json(updated)
    else res.status(404).end()
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
