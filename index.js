const express = require('express')
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})