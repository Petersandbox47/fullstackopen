import { createContext, useContext, useReducer, useEffect } from 'react'
import storageService from '../services/storage'
import blogService from '../services/blogs'

const UserContext = createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(reducer, null)

  useEffect(() => {
    const loggedUser = storageService.loadUser()
    if (loggedUser) {
      dispatch({ type: 'SET', payload: loggedUser })
      blogService.setToken(loggedUser.token)
    }
  }, [])

  return (
    <UserContext.Provider value={[user, dispatch]}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const [user] = useContext(UserContext)
  return user
}

export const useUserDispatch = () => {
  const [, dispatch] = useContext(UserContext)
  return dispatch
}
