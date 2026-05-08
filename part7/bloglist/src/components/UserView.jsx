import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'

const UserView = () => {
  const { id } = useParams()
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  const user = users?.find((u) => u.id === id)
  if (!user) return <div>loading...</div>

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserView
