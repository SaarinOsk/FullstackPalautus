import { useState, useEffect } from 'react'
import personService from './services/person.js'

const Person = ({person, setPersons, persons, setMessage}) => {

  const handleClick = () => {
    if(window.confirm(`Delete ${person.name} ?`)) {
      personService.del(person.id)
      setPersons(persons.filter(p => p.id !== person.id))
      
      setMessage(
        `Deleted ${person.name}`
      )
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      {person.name} {person.number}
      <button onClick={handleClick}>delete</button>
    </div>
  )
}

const Input = ({text, handleChange, value}) => {
  return (
    <div>
      {text}<input value={value} onChange={handleChange} />
    </div>
  )
}

const Persons = ({persons, setPersons, setMessage}) => {
  return (
    <div>
        {persons.map(person => 
          <Person key={person.id} person={person} setPersons={setPersons} persons={persons} setMessage={setMessage}/>
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

const Notification = ({text, color}) => {
  if (text === null) {
    return null
  }
  console.log(color)

  const notifStyle = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={notifStyle}>
      {text}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newNumber, setNewNumber] = useState('') 
  const [newName, setNewName] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [color, setColor] = useState('green')

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
    personService
      .getAll()
        .then(initialPersons => setPersons(initialPersons))  
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.every(n => n.name != newName)) {
      const personObject = {name: newName, number: newNumber}
      personService
        .create(personObject)
          .then(createdPerson => {
            setPersons(persons.concat(createdPerson))
            setNewName('')
            setNewNumber('')
          })
      setMessage(
        `Added ${personObject.name}`
      )
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    
    else {
      //alert(`${newName} is already added to the phonebook`)
      if(window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)) {
        const personObject = persons.find(person => person.name === newName)
        personObject.number = newNumber
        personService.update(personObject)
          .then(newPerson => {
            setPersons(persons.map(person => person.id !== newPerson.id ? person : newPerson))
            setMessage(
              `Updated ${personObject.name}'s number`
            )
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error =>{
            setColor('red')
            setMessage(
              `Information of ${personObject.name} has already been removed from server `
            )
            setTimeout(() => {
              setColor('green')
              setMessage(null)
            }, 5000)
          })

          
      }
    }
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification text={message} color={color} /> 
      <Input text={"filter shown with"} value={newFilter} handleChange={handleFilter} />
      <h2>add a new</h2>
      <PersonForm onSubmit={addPerson} name={newName} handleName={handleNameChange} number={newNumber} handleNumber={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow()} setPersons={setPersons} setMessage={setMessage} />
    </div>
  )

}

export default App