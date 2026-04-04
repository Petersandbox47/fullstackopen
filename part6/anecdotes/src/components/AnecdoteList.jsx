import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

// Exercise 6.8: AnecdoteList component
const AnecdoteList = () => {
  const dispatch = useDispatch()
  // Exercise 6.5: sort by votes descending
  const anecdotes = useSelector((state) =>
    [...state].sort((a, b) => b.votes - a.votes)
  )

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes{' '}
            <button onClick={() => dispatch(voteAnecdote(anecdote.id))}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
