// Exercise 4.3
const dummy = (blogs) => 1

// Exercise 4.4
const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

// Exercise 4.5
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max))
}

// Exercise 4.6
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  const author = Object.keys(counts).reduce((a, b) => (counts[a] >= counts[b] ? a : b))
  return { author, blogs: counts[author] }
}

// Exercise 4.7
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  const author = Object.keys(likes).reduce((a, b) => (likes[a] >= likes[b] ? a : b))
  return { author, likes: likes[author] }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
