import { useState } from 'react'
import loginService from '../services/login'
import storageService from '../services/storage'
import blogService from '../services/blogs'
import { useNotification } from '../context/NotificationContext'
import { useUserDispatch } from '../context/UserContext'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const notify = useNotification()
  const dispatch = useUserDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      storageService.saveUser(user)
      blogService.setToken(user.token)
      dispatch({ type: 'SET', payload: user })
      setUsername('')
      setPassword('')
    } catch (_error) {
      notify('wrong username or password', 'error')
    }
  }

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            data-testid="username"
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="password"
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
