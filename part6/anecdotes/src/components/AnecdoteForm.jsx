import { useCreateAnecdote } from '../hooks/useAnecdotes'
import { useNotification } from '../context/NotificationContext'

const AnecdoteForm = () => {
  const createMutation = useCreateAnecdote()
  const { showNotification } = useNotification()

  // Exercise 6.17: create anecdote with mutation
  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    // Exercise 6.21: error handling for too-short content
    createMutation.mutate(content, {
      onSuccess: () => {
        showNotification(`you created '${content}'`)
      },
      onError: () => {
        showNotification('too short anecdote, must have length 5 or more')
      },
    })
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
