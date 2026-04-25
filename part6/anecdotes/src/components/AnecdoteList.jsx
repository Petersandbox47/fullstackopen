import useAnecdoteStore from '../stores/anecdoteStore'
import useNotificationStore from '../stores/notificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const voteAnecdote = useAnecdoteStore((state) => state.voteAnecdote)
  const deleteAnecdote = useAnecdoteStore((state) => state.deleteAnecdote)
  const showNotification = useNotificationStore((state) => state.showNotification)

  // Sort by votes descending
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  const handleVote = async (anecdote) => {
    await voteAnecdote(anecdote.id)
    showNotification(`you voted '${anecdote.content}'`)
  }

  // Exercise 6.11: delete if votes === 0
  const handleDelete = async (anecdote) => {
    if (anecdote.votes === 0 && window.confirm(`Delete '${anecdote.content}'?`)) {
      await deleteAnecdote(anecdote.id)
      showNotification(`deleted '${anecdote.content}'`)
    }
  }

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes{' '}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => handleDelete(anecdote)}>delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
