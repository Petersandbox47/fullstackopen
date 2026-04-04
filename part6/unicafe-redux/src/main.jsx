import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import counterReducer from './reducer'

const store = createStore(counterReducer)

const App = () => {
  const { good, ok, bad } = store.getState()

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={() => store.dispatch({ type: 'GOOD' })}>good</button>
      <button onClick={() => store.dispatch({ type: 'OK' })}>ok</button>
      <button onClick={() => store.dispatch({ type: 'BAD' })}>bad</button>
      <button onClick={() => store.dispatch({ type: 'RESET' })}>reset</button>

      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><td>good</td><td>{good}</td></tr>
          <tr><td>ok</td><td>{ok}</td></tr>
          <tr><td>bad</td><td>{bad}</td></tr>
        </tbody>
      </table>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
const render = () => root.render(<App />)
render()
store.subscribe(render)
