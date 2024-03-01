const express = require('express')
const app = express()

const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const path = require('path')

const wrapAsync = require('./utils/wrapAsync')
const ErrorHandler = require('./utils/ErrorHandler')

// define port
const port = 3000

// ejs templating
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// define middleware
const validatePlace = require('./middleware/validatePlace');
const validateReview = require('./middleware/validateReview');

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
const Review = require('./models/review')

// mongodb connected
mongoose.connect('mongodb://127.0.0.1:27017/bestpoint')
    try {
        console.log('Connected to MongoDB')
    } catch (error) {
        console.log(error)
    }


// define routes
app.get('/places', wrapAsync(async (req, res) =>{
    const places = await Place.find()
    res.render('places/index', {places})
}))

app.get('/places/create', (req, res) =>{
    res.render('places/create')
})

app.get('/places/:id', wrapAsync(async (req, res) =>{
    const {id} = req.params
    const place = await Place.findById(id).populate('reviews')
    res.render('places/show', {place})
}))

app.post('/places', validatePlace, wrapAsync(async (req, res) =>{
    const place = new Place(req.body.place)
    place.save()
    res.redirect('/places')
}))

app.get('/places/:id/edit', wrapAsync(async (req, res) =>{
    const {id} = req.params
    const place = await Place.findById(id)
    res.render('places/edit', {place})
}))

app.put('/places/:id', validatePlace, wrapAsync(async (req, res) =>{
    const {id} = req.params
    await Place.findByIdAndUpdate(id, req.body.place,
        {runValidators: true}
    )
    res.redirect(`/places/${id}`)
}))

app.delete('/places/:id', wrapAsync(async (req, res) =>{
    const {id} = req.params
    await Place.findByIdAndDelete(id)
    res.redirect(`/places`)
}))

app.post('/places/:id/reviews', validateReview, wrapAsync(async (req, res)  =>{
    const {id} = req.params
    const review = new Review(req.body.review)
    const place = await Place.findById(id)
    place.reviews.push(review)
    review.save()
    place.save()
    res.redirect(`/places/${id}`)
}))


app.all('*', (req, res, next) =>{
    next(new ErrorHandler('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', {err})
})

app.listen(port, () =>{
    console.log(`Server running on: http://localhost:${port}`)
})

