import { describe, test, expect, beforeEach, vi } from 'vitest'
import useAnecdoteStore from '../stores/anecdoteStore'
import * as anecdoteService from '../services/anecdotes'

// Mock the service
vi.mock('../services/anecdotes')

describe('Anecdote Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useAnecdoteStore.setState({ anecdotes: [] })
  })

  // Exercise 6.12: store initializes with backend data
  test('initializes with anecdotes from backend', async () => {
    const mockAnecdotes = [
      { id: '1', content: 'Test 1', votes: 0 },
      { id: '2', content: 'Test 2', votes: 0 },
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    await useAnecdoteStore.getState().initializeAnecdotes()

    expect(useAnecdoteStore.getState().anecdotes).toEqual(mockAnecdotes)
  })

  // Exercise 6.14: voting increases vote count
  test('voting increases the vote count', async () => {
    const initialAnecdote = { id: '1', content: 'Test', votes: 5 }
    const updatedAnecdote = { id: '1', content: 'Test', votes: 6 }

    useAnecdoteStore.setState({ anecdotes: [initialAnecdote] })
    anecdoteService.vote.mockResolvedValue(updatedAnecdote)

    await useAnecdoteStore.getState().voteAnecdote('1')

    const anecdotes = useAnecdoteStore.getState().anecdotes
    expect(anecdotes[0].votes).toBe(6)
  })
})
