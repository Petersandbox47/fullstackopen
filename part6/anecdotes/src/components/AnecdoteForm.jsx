import useAnecdoteStore from '../stores/anecdoteStore'
import useNotificationStore from '../stores/notificationStore'

const AnecdoteForm = () => {
  const createAnecdote = useAnecdoteStore((state) => state.createAnecdote)
  const showNotification = useNotificationStore((state) => state.showNotification)

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    await createAnecdote(content)
    showNotification(`you created '${content}'`)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
