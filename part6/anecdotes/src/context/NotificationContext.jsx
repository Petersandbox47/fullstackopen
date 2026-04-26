import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

// Exercise 6.20-6.22: Notification Context Provider
export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

// Exercise 6.22: custom hook for notifications
export const useNotification = () => {
  const [notification, dispatch] = useContext(NotificationContext)

  const showNotification = (message, seconds = 5) => {
    dispatch({ type: 'SHOW', payload: message })
    setTimeout(() => dispatch({ type: 'CLEAR' }), seconds * 1000)
  }

  return { notification, showNotification }
}

export default NotificationContext
