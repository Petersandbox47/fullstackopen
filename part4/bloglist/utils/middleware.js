const jwt = require('jsonwebtoken')
const User = require('../models/user')
const logger = require('./logger')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

// Exercise 4.20: extract token from Authorization header
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  } else {
    req.token = null
  }
  next()
}

// Exercise 4.22: extract user from token
const userExtractor = async (req, res, next) => {
  try {
    if (!req.token) {
      req.user = null
      return next()
    }
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    req.user = await User.findById(decodedToken.id)
    next()
  } catch (error) {
    next(error)
  }
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' })
  }
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }
  next(error)
}

module.exports = { requestLogger, tokenExtractor, userExtractor, unknownEndpoint, errorHandler }
