import { useState, useEffect } from 'react'
import axios from 'axios'

const Person = ({person}) => {
  return (
    <p>
      {person.name} {person.number}
    </p>
  )
}

const Input = ({text, handleChange, value}) => {
  return (
    <div>
      {text}<input value={value} onChange={handleChange} />
    </div>
  )
}

const Persons = ({persons}) => {
  return (
    <div>
        {persons.map(person => 
          <Person key={person.name} person={person} />
        )}
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
        <Input text={"name: "} value={props.name} handleChange={props.handleName} />
        <Input text={"number: "} value={props.number} handleChange={props.handleNumber} />
        <div><button type="submit">add</button></div>
    </form>
  )
}



const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newNumber, setNewNumber] = useState('') 
  const [newName, setNewName] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setNewFilter(event.target.value)
  }
  
  const personsToShow = () => {
    if(newFilter) {
      const realFilter = newFilter.toLowerCase()

      return persons.filter(p => p.name.toLowerCase().includes(realFilter))
    }
    else {
      return persons
    }
  }

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => setPersons(response.data))  
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.every(n => n.name != newName)) {
      const copy = persons.concat({
        name: newName, number: newNumber
      })
      setPersons(copy)
      setNewName('')
      setNewNumber('')
    }
    
    else {
      alert(`${newName} is already added to the phonebook`)
    }
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Input text={"filter shown with"} value={newFilter} handleChange={handleFilter} />
      <h2>add a new</h2>
      <PersonForm onSubmit={addPerson} name={newName} handleName={handleNameChange} number={newNumber} handleNumber={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow()} />
    </div>
  )

}

export default App