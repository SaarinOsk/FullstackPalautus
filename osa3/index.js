require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const app = express()

app.use(express.json())


const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
morgan.token('content', (req) => { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(express.static('build'))


app.get('/info', (req, res) => {
  Person.find({})
    .then(result => {
      const now = Date.now()
      const formated = new Date(now).toString()
      res.send(`
            <p>Phonebook has info on ${result.length} people.</p>
            <p>${formated}</p>
            `)
    })

})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndRemove(id)
    .then(
      res.status(204).end()
    )
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const person = req.body

  const personToSave = new Person({
    name: person.name,
    number: person.number
  })

  Person.find({ name: person.name }).then(result => {
    if(result.length === 0) {
      personToSave.save()
        .then(savedPerson => {
          res.json(savedPerson)
        })
        .catch(error => next(error))

    } else {
      return res.status(400).json({ error: `The name ${person.name} is already inserted to the phonebook.` })

    }

  })


})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body
  Person.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(result => res.json(result))
    .catch(error => next(error))
})


const errorHandler = (error, req, res, next) => {
  console.log(error)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})