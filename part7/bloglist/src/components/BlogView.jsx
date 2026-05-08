import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotification } from '../context/NotificationContext'
import { useUser } from '../context/UserContext'

const BlogView = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const notify = useNotification()
  const user = useUser()
  const [comment, setComment] = useState('')

  const { data: blogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const blog = blogs?.find((b) => b.id === id)

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

  const commentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      setComment('')
    },
  })

  if (!blog) return <div>Blog not found</div>

  const canDelete = user && blog.user && user.username === blog.user.username

  const handleComment = (e) => {
    e.preventDefault()
    commentMutation.mutate({ id: blog.id, comment })
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes <button onClick={() => likeMutation.mutate(blog)}>like</button>
      </div>
      <div>added by {blog.user?.name}</div>

      <h3>comments</h3>
      <form onSubmit={handleComment}>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="add a comment"
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {(blog.comments || []).map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogView
