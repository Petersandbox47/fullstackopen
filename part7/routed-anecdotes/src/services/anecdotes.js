import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const create = async (anecdote) => {
  const response = await axios.post(baseUrl, { ...anecdote, votes: 0 })
  return response.data
}

export const remove = async (id) => {
  await axios.delete(`${baseUrl}/${id}`)
}
