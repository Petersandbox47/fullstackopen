import { create } from 'zustand'
import * as anecdoteService from '../services/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],

  initializeAnecdotes: async () => {
    const anecdotes = await anecdoteService.getAll()
    set({ anecdotes })
  },

  createAnecdote: async (content) => {
    const newAnecdote = await anecdoteService.create(content)
    set((state) => ({ anecdotes: [...state.anecdotes, newAnecdote] }))
  },

  // Exercise 6.9: vote saves to backend
  voteAnecdote: async (id) => {
    const updated = await anecdoteService.vote(id)
    set((state) => ({
      anecdotes: state.anecdotes.map((a) => (a.id === id ? updated : a)),
    }))
  },

  // Exercise 6.11: delete anecdotes with 0 votes
  deleteAnecdote: async (id) => {
    await anecdoteService.remove(id)
    set((state) => ({
      anecdotes: state.anecdotes.filter((a) => a.id !== id),
    }))
  },
}))

export default useAnecdoteStore
