import { render, screen } from '@testing-library/react'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import AnecdoteList from '../components/AnecdoteList'
import useAnecdoteStore from '../stores/anecdoteStore'
import useNotificationStore from '../stores/notificationStore'

vi.mock('../stores/notificationStore', () => ({
  default: vi.fn(() => ({
    showNotification: vi.fn(),
  })),
}))

describe('AnecdoteList component', () => {
  beforeEach(() => {
    useNotificationStore.mockReturnValue({ showNotification: vi.fn() })
  })

  // Exercise 6.13: anecdotes displayed sorted by votes
  test('anecdotes are sorted by votes descending', () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: '1', content: 'Low votes', votes: 2 },
        { id: '2', content: 'High votes', votes: 10 },
        { id: '3', content: 'Medium votes', votes: 5 },
      ],
      voteAnecdote: vi.fn(),
      deleteAnecdote: vi.fn(),
    })

    render(<AnecdoteList />)

    const anecdotes = screen.getAllByText(/has \d+ votes/)
    expect(anecdotes[0].textContent).toContain('has 10 votes')
    expect(anecdotes[1].textContent).toContain('has 5 votes')
    expect(anecdotes[2].textContent).toContain('has 2 votes')
  })

  test('only anecdotes with 0 votes show delete button', () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: '1', content: 'Has votes', votes: 5 },
        { id: '2', content: 'No votes', votes: 0 },
      ],
      voteAnecdote: vi.fn(),
      deleteAnecdote: vi.fn(),
    })

    render(<AnecdoteList />)

    const deleteButtons = screen.getAllByText('delete')
    expect(deleteButtons).toHaveLength(1)
  })
})
