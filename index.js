const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('data', (req, res) => {
    return JSON.stringify(req.body);
});

const skipPostMethod = (req, res) => req.method === "POST"
const skipOtherMethodsThanPost = (req, res) => req.method !== "POST"

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data', {
    skip: skipOtherMethodsThanPost
}))

app.use(morgan('tiny', {
    skip: skipPostMethod
}))

let persons = [
    {
        id: 1,
        name: "Aku Ankka",
        number: "555-7777"
    },
    {
        id: 2,
        name: "Iines Ankka",
        number: "122363-988"
    },
    {
        id: 3,
        name: "Hau Koira",
        number: "11-444-77733"
    },
    {
        id: 4,
        name: "Miu Kissa",
        number: "88-999-88"
    },
    {
        id: 5,
        name: "Ahven Kala",
        number: "000-777"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Riikan eka Node-sovellus!</h1>')
})

app.get('/info', (req, res) => {
    res.send(`
    <p>Riikan puhelinluettelossa on ${persons.length} henkilöä.</p>
    <p>${Date()}</p>
    `)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

// Yksittäisen henkilön hakeminen
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// Henkilön poistaminen
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * (9999 - 1) + 1);
}

// Henkilön lisääminen
app.post('/api/persons', (request, response) => {
    const body = request.body
    const nameExists = persons.some(person => person.name === body.name)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name and/or number missing'
        })
    } else if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})