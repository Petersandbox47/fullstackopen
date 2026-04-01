import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import BlogForm from '../components/BlogForm'

// Exercise 5.16: BlogForm calls handler with correct details
describe('BlogForm', () => {
  test('calls onCreate with correct details when form is submitted', async () => {
    const user = userEvent.setup()
    const mockCreate = vi.fn()

    render(<BlogForm onCreate={mockCreate} />)

    await user.type(screen.getByPlaceholderText('blog title'), 'New Test Blog')
    await user.type(screen.getByPlaceholderText('author'), 'New Author')
    await user.type(screen.getByPlaceholderText('url'), 'https://newblog.com')

    await user.click(screen.getByText('create'))

    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(mockCreate).toHaveBeenCalledWith({
      title: 'New Test Blog',
      author: 'New Author',
      url: 'https://newblog.com',
    })
  })
})
