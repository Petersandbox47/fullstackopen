import { useEffect } from 'react'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import useAnecdoteStore from './stores/anecdoteStore'

const App = () => {
  const initializeAnecdotes = useAnecdoteStore((state) => state.initializeAnecdotes)

  useEffect(() => {
    initializeAnecdotes()
  }, [initializeAnecdotes])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}

export default App
