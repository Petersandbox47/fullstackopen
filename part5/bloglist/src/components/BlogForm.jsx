import { useState } from 'react'

// Exercise 5.3: Blog creation form
const BlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onCreate({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="blog title" />
        </div>
        <div>
          author:
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="author" />
        </div>
        <div>
          url:
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="url" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
