import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
import { useField, useAnecdotes } from './hooks'

const Menu = () => (
  <div>
    <Link to="/">anecdotes</Link> &nbsp;
    <Link to="/create">create new</Link> &nbsp;
    <Link to="/about">about</Link>
  </div>
)

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map((a) => (
        <li key={a.id}>
          <Link to={`/anecdotes/${a.id}`}>{a.content}</Link>
        </li>
      ))}
    </ul>
  </div>
)

const Anecdote = ({ anecdotes }) => {
  const { id } = useParams()
  const anecdote = anecdotes.find((a) => a.id === id)
  if (!anecdote) return <div>Anecdote not found</div>
  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account of an individual person or an incident.</em>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href="https://fullstackopen.com/">Full Stack Open</a>
  </div>
)

const CreateNew = ({ addAnecdote, setNotification }) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
    })
    setNotification(`a new anecdote '${content.value}' created!`)
    setTimeout(() => setNotification(''), 5000)
    navigate('/')
  }

  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  // destructure to exclude reset from spread
  const { reset: _cr, ...contentProps } = content
  const { reset: _ar, ...authorProps } = author
  const { reset: _ir, ...infoProps } = info

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>content <input {...contentProps} /></div>
        <div>author <input {...authorProps} /></div>
        <div>url for more info <input {...infoProps} /></div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

const Notification = ({ message }) => {
  if (!message) return null
  return (
    <div style={{ border: '1px solid green', padding: 10, marginBottom: 10, color: 'green' }}>
      {message}
    </div>
  )
}

const App = () => {
  const { anecdotes, addAnecdote } = useAnecdotes()
  const [notification, setNotification] = useState('')

  return (
    <Router>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification message={notification} />
      <Routes>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/anecdotes/:id" element={<Anecdote anecdotes={anecdotes} />} />
        <Route path="/create" element={<CreateNew addAnecdote={addAnecdote} setNotification={setNotification} />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
