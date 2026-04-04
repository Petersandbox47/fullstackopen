const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => ({
  content: anecdote,
  id: getId(),
  votes: 0,
})

const initialState = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
].map(asObject)

// Exercise 6.6: action creators
export const voteAnecdote = (id) => ({ type: 'VOTE', payload: { id } })
export const createAnecdote = (content) => ({ type: 'CREATE', payload: { content } })

// Exercise 6.3-6.4: reducer handling VOTE and CREATE
const anecdoteReducer = (state = initialState, action) => {
  switch (action.type) {
    // Exercise 6.3: vote
    case 'VOTE':
      return state.map((a) =>
        a.id === action.payload.id ? { ...a, votes: a.votes + 1 } : a
      )
    // Exercise 6.4: create new anecdote
    case 'CREATE':
      return state.concat(asObject(action.payload.content))
    default:
      return state
  }
}

export default anecdoteReducer
