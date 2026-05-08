import { useNotificationValue } from '../context/NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()
  if (!notification) return null

  const style = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: notification.type === 'error' ? 'red' : 'green',
    borderColor: notification.type === 'error' ? 'red' : 'green',
  }

  return <div style={style}>{notification.message}</div>
}

export default Notification
