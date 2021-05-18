const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :body'
))

morgan.token('body', function (req, res) {return JSON.stringify(req.body)})

let persons = [
    {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
    },
    {
    id: 2,
    name: "Ada Lovelace",
    number: "34-65-678678678"
    },
    {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
    },
    {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const info = `<p>Phonebook has info for ${persons.length} people</p>` +
    `<p>${Date()}</p>`
    response.send(info)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if (persons.map((person) => person.name).includes(body.name)) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }
    const person ={
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const generateId = () => {
    const max = 1000000
    id = Math.ceil(Math.random() * max)
    return id
}
