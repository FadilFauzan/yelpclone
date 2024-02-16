const express = require('express')
const app = express()

const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const path = require('path')

// define port
const port = 3000

// ejs templating
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

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
const Place = require('./models/place')

// mongodb connected
mongoose.connect('mongodb://127.0.0.1:27017/bestpoint')
    try {
        console.log('Connected to MongoDB')
    } catch (error) {
        console.log(error)
    }


// define routes
app.get('/places', async (req, res) =>{
    const places = await Place.find()
    res.render('places/index', {places})
})

app.get('/places/:id', async (req, res) =>{
    const {id} = req.params
    const place = await Place.findById(id)
    res.render('places/show', {place})
})

app.get('/place/create', (req, res) =>{
    res.render('places/create')
})

app.post('/places', async (req, res) =>{
    const place = new Place(req.body)
    // console.log(place)
    place.save()
    res.redirect('/places')
})

app.get('/places/:id/edit', async (req, res) =>{
    const {id} = req.params
    const place = await Place.findById(id)
    res.render('places/edit', {place})
})

app.put('/places/:id', async (req, res) =>{
    const {id} = req.params
    await Place.findByIdAndUpdate(id, req.body,
        {runValidators: true}
    )
    res.redirect(`/places/${id}`)
})

app.delete('/places/:id', async (req, res) =>{
    const {id} = req.params
    await Place.findByIdAndDelete(id)
    res.redirect(`/places`)
})

app.listen(port, () =>{
    console.log(`Server running on: http://localhost:${port}`)
})

