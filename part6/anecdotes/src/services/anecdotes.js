import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const create = async (content) => {
  const newAnecdote = { content, votes: 0 }
  const response = await axios.post(baseUrl, newAnecdote)
  return response.data
}

export const vote = async (id) => {
  const anecdote = await axios.get(`${baseUrl}/${id}`)
  const updated = { ...anecdote.data, votes: anecdote.data.votes + 1 }
  const response = await axios.put(`${baseUrl}/${id}`, updated)
  return response.data
}

export const remove = async (id) => {
  await axios.delete(`${baseUrl}/${id}`)
}
