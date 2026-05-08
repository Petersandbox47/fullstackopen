import axios from 'axios'

const baseUrl = '/api/blogs'
let token = null

const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null
}

const getAll = () => axios.get(baseUrl).then((res) => res.data)

const create = (newBlog) =>
  axios.post(baseUrl, newBlog, { headers: { Authorization: token } }).then((res) => res.data)

const update = (id, updatedBlog) =>
  axios.put(`${baseUrl}/${id}`, updatedBlog).then((res) => res.data)

const remove = (id) =>
  axios.delete(`${baseUrl}/${id}`, { headers: { Authorization: token } })

const addComment = (id, comment) =>
  axios.post(`${baseUrl}/${id}/comments`, { comment }).then((res) => res.data)

export default { setToken, getAll, create, update, remove, addComment }
