import { useState, useEffect } from 'react'
import * as anecdoteService from '../services/anecdotes'

// Exercise 7.1-7.2: useField hook with reset
export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => setValue('')

  return {
    type,
    value,
    onChange,
    reset,
  }
}

// Exercise 7.4-7.6: useAnecdotes hook with CRUD
export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then((data) => setAnecdotes(data))
  }, [])

  const addAnecdote = async (anecdote) => {
    const newAnecdote = await anecdoteService.create(anecdote)
    setAnecdotes((prev) => [...prev, newAnecdote])
  }

  const deleteAnecdote = async (id) => {
    await anecdoteService.remove(id)
    setAnecdotes((prev) => prev.filter((a) => a.id !== id))
  }

  return { anecdotes, addAnecdote, deleteAnecdote }
}
