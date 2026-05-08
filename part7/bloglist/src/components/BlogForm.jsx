import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotification } from '../context/NotificationContext'

const BlogForm = ({ onClose }) => {
  const titleRef = useRef()
  const authorRef = useRef()
  const urlRef = useRef()
  const queryClient = useQueryClient()
  const notify = useNotification()

  const createMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      onClose()
    },
    onError: () => notify('failed to create blog', 'error'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate({
      title: titleRef.current.value,
      author: authorRef.current.value,
      url: urlRef.current.value,
    })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>title: <input ref={titleRef} placeholder="blog title" /></div>
        <div>author: <input ref={authorRef} placeholder="author" /></div>
        <div>url: <input ref={urlRef} placeholder="url" /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
