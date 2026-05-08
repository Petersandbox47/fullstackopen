const KEY = 'loggedBlogappUser'

const saveUser = (user) => localStorage.setItem(KEY, JSON.stringify(user))

const loadUser = () => {
  const data = localStorage.getItem(KEY)
  return data ? JSON.parse(data) : null
}

const removeUser = () => localStorage.removeItem(KEY)

export default { saveUser, loadUser, removeUser }
