import { useVoteAnecdote, useDeleteAnecdote } from '../hooks/useAnecdotes'
import { useNotification } from '../context/NotificationContext'

const AnecdoteList = ({ anecdotes }) => {
  const voteMutation = useVoteAnecdote()
  const deleteMutation = useDeleteAnecdote()
  const { showNotification } = useNotification()

  // Sort by votes descending
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  // Exercise 6.18: vote with mutation
  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote.id, {
      onSuccess: () => {
        showNotification(`you voted '${anecdote.content}'`)
      },
    })
  }

  const handleDelete = (anecdote) => {
    if (anecdote.votes === 0 && window.confirm(`Delete '${anecdote.content}'?`)) {
      deleteMutation.mutate(anecdote.id, {
        onSuccess: () => {
          showNotification(`deleted '${anecdote.content}'`)
        },
      })
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
