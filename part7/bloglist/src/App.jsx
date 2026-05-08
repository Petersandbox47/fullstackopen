import { useRef } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import blogService from './services/blogs'
import storageService from './services/storage'
import { useNotification } from './context/NotificationContext'
import { useUser, useUserDispatch } from './context/UserContext'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import BlogView from './components/BlogView'
import UserList from './components/UserList'
import UserView from './components/UserView'
import Togglable from './components/Togglable'

const App = () => {
  const user = useUser()
  const dispatch = useUserDispatch()
  const blogFormRef = useRef()

  const { data: blogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    enabled: !!user,
  })

  const handleLogout = () => {
    storageService.removeUser()
    blogService.setToken(null)
    dispatch({ type: 'CLEAR' })
  }

  const sortedBlogs = blogs ? [...blogs].sort((a, b) => b.likes - a.likes) : []

  if (!user) {
    return (
      <div>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  return (
    <div>
      <nav>
        <Link to="/">blogs</Link> &nbsp;
        <Link to="/users">users</Link> &nbsp;
        <span>{user.name} logged in <button onClick={handleLogout}>logout</button></span>
      </nav>

      <h2>blog app</h2>
      <Notification />

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm onClose={() => blogFormRef.current.toggleVisibility()} />
              </Togglable>
              {sortedBlogs.map((blog) => (
                <Blog key={blog.id} blog={blog} />
              ))}
            </div>
          }
        />
        <Route path="/blogs/:id" element={<BlogView />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
