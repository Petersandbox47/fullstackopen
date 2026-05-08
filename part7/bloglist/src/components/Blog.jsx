import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotification } from '../context/NotificationContext'
import { useUser } from '../context/UserContext'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
}

const Blog = ({ blog }) => {
  const queryClient = useQueryClient()
  const notify = useNotification()
  const user = useUser()

  const likeMutation = useMutation({
    mutationFn: (b) =>
      blogService.update(b.id, {
        title: b.title,
        author: b.author,
        url: b.url,
        likes: b.likes + 1,
        user: b.user?.id || b.user,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`blog ${blog.title} removed`)
    },
  })

  const canDelete = user && blog.user && user.username === blog.user.username

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteMutation.mutate(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> {blog.author}
      <button onClick={() => likeMutation.mutate(blog)}>like</button>
      {canDelete && <button onClick={handleDelete}>remove</button>}
    </div>
  )
}

export default Blog
