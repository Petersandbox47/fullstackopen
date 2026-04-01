import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import Blog from '../components/Blog'

const blog = {
  id: '1',
  title: 'Test Blog Title',
  author: 'Test Author',
  url: 'https://testblog.com',
  likes: 42,
  user: { id: 'u1', name: 'Test User', username: 'testuser' },
}

const currentUser = { username: 'testuser', name: 'Test User' }

// Exercise 5.13: title and author shown, url and likes hidden by default
describe('Blog component', () => {
  test('renders title and author by default', () => {
    render(<Blog blog={blog} onLike={vi.fn()} onDelete={vi.fn()} currentUser={currentUser} />)

    expect(screen.getByText(/Test Blog Title/)).toBeInTheDocument()
    expect(screen.getByText(/Test Author/)).toBeInTheDocument()
  })

  test('does not render url or likes by default', () => {
    render(<Blog blog={blog} onLike={vi.fn()} onDelete={vi.fn()} currentUser={currentUser} />)

    expect(screen.queryByText('https://testblog.com')).not.toBeInTheDocument()
    expect(screen.queryByText(/likes 42/)).not.toBeInTheDocument()
  })

  // Exercise 5.14: url and likes shown after clicking view
  test('shows url and likes when view button is clicked', async () => {
    const user = userEvent.setup()
    render(<Blog blog={blog} onLike={vi.fn()} onDelete={vi.fn()} currentUser={currentUser} />)

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(screen.getByText('https://testblog.com')).toBeInTheDocument()
    expect(screen.getByText(/likes 42/)).toBeInTheDocument()
  })

  // Exercise 5.15: like handler called twice when button clicked twice
  test('calls like handler twice when like button clicked twice', async () => {
    const user = userEvent.setup()
    const mockLike = vi.fn()
    render(<Blog blog={blog} onLike={mockLike} onDelete={vi.fn()} currentUser={currentUser} />)

    // First open the details
    await user.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLike).toHaveBeenCalledTimes(2)
  })
})
