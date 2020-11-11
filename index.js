require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())

morgan.token('data', (req, res) => {
    return JSON.stringify(req.body);
});

const skipPostMethod = (req, res) => req.method === "POST"
const skipOtherMethodsThanPost = (req, res) => req.method !== "POST"

app.use(express.static('build'))

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
    Person.countDocuments({}).then(countedPersons => {
        res.send(`
    <p>Riikan puhelinluettelossa on ${countedPersons} henkilöä.</p>
    <p>${Date()}</p>
    `)
    })
})

// Kaikkien henkilöiden hakeminen
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// Yksittäisen henkilön hakeminen
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// Henkilön poistaminen
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            if (result) {
                response.status(204).end()
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

const generateId = () => {
    return Math.floor(Math.random() * (9999 - 1) + 1);
}

// Henkilön lisääminen
app.post('/api/persons', (request, response) => {
    const body = request.body
    // const nameExists = persons.some(person => person.name === body.name)

    if (body.name === undefined) {
        return response.status(400).json({ error: 'Name missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
        .catch(error => next(error))

    /*
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name and/or number missing'
        })
    } else if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    */
})

// Sisällön muokkaaminen
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            if (updatedPerson !== null) {
                response.json(updatedPerson)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// Virheidenkäsittelijä
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})