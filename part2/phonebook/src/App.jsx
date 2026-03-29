import { useState, useEffect } from 'react'
import personService from './personService'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import Notification from './Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: 'success' })

  useEffect(() => {
    personService.getAll().then((data) => setPersons(data))
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: 'success' }), 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existing = persons.find((p) => p.name === newName)

    if (existing) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updated = { ...existing, number: newNumber }
        personService
          .update(existing.id, updated)
          .then((returnedPerson) => {
            setPersons(persons.map((p) => (p.id !== existing.id ? p : returnedPerson)))
            showNotification(`Updated ${returnedPerson.name}`)
            setNewName('')
            setNewNumber('')
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              showNotification(
                `Information of ${existing.name} has already been removed from server`,
                'error'
              )
              setPersons(persons.filter((p) => p.id !== existing.id))
            } else {
              showNotification(error.response.data.error, 'error')
            }
          })
      }
      return
    }

    const newPerson = { name: newName, number: newNumber }
    personService
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        showNotification(`Added ${returnedPerson.name}`)
        setNewName('')
        setNewNumber('')
      })
      .catch((error) => {
        showNotification(error.response.data.error, 'error')
      })
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(person.id).then(() => {
        setPersons(persons.filter((p) => p.id !== person.id))
      })
    }
  }

  const personsToShow = filter
    ? persons.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter filter={filter} onChange={(e) => setFilter(e.target.value)} />

      <h3>add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        onNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App
