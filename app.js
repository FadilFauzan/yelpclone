const express = require('express')
const app = express()

const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session');

// define port
const port = 3000

// ejs templating
app.set('view engine', 'ejs')
app.set('views', 'views')

// define middleware
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'secret-key',
    rersave: false,
    saveUnitialized: true,
    // cookie: { secure: true }
}))

// models


// mongodb connected
mongoose.connect('mongodb://127.0.0.1:27017/bestpoint')
    try {
        console.log('Connected to MongoDB')
    } catch (error) {
        console.log(error)
    }

app.get('/', (req, res) =>{
    res.send('hallo world')
})

app.listen(port, () =>{
    console.log(`Server running on: http://localhost:${port}`)
})

