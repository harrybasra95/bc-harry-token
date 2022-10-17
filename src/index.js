import 'dotenv/config'
import express from 'express'

const app = express()

// Parsing config for requests
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// EJS files config
app.set('views', './src/views')
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(3001, () => {
    console.log('listening on port 3000')
})
