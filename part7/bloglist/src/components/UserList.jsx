import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'

const UserList = () => {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (!users) return <div>loading...</div>

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td><Link to={`/users/${u.id}`}>{u.name}</Link></td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
