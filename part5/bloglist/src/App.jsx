import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({ message: null, type: 'success' })

  // Exercise 5.2: load user from localStorage on mount
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs))
    }
  }, [user])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: 'success' }), 5000)
  }

  // Exercise 5.1: handle login
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })

      // Exercise 5.2: save to localStorage
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
    } catch (error) {
      showNotification('wrong username or password', 'error')
    }
  }

  // Exercise 5.2: handle logout
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    setBlogs([])
  }

  // Exercise 5.3: handle blog creation
  const handleCreateBlog = async (newBlog) => {
    try {
      const created = await blogService.create(newBlog)
      setBlogs(blogs.concat(created))
      showNotification(`a new blog ${created.title} by ${created.author} added`)
    } catch (error) {
      showNotification('failed to create blog', 'error')
    }
  }

  // Exercise 5.1: show login form if not logged in
  if (!user) {
    return (
      <div>
        <Notification message={notification.message} type={notification.type} />
        <LoginForm
          username={username}
          password={password}
          onUsernameChange={(e) => setUsername(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onSubmit={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <BlogForm onCreate={handleCreateBlog} />

      <h3>blog list</h3>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
