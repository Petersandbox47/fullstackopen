import { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

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

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(reducer, null)
  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const [, dispatch] = useContext(NotificationContext)

  const notify = (message, type = 'success') => {
    dispatch({ type: 'SET', payload: { message, type } })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }

  return notify
}

export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext)
  return notification
}
