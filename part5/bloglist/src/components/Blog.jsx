import { useState } from 'react'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
}

// Exercise 5.7-5.11: Blog with toggle, likes, delete
const Blog = ({ blog, onLike, onDelete, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const canDelete = currentUser && blog.user && currentUser.username === blog.user.username

  return (
    <div style={blogStyle}>
      <span>
        {blog.title} {blog.author}
      </span>
      <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>

      {visible && (
        <div>
          <div>{blog.url}</div>
          {/* Exercise 5.8: like button */}
          <div>
            likes {blog.likes}
            <button onClick={() => onLike(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {/* Exercise 5.11: delete only for creator */}
          {canDelete && (
            <button onClick={() => onDelete(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
