const express = require('express')
const app = express()

const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')

const ErrorHandler = require('./utils/ErrorHandler')

// define port
const port = 3000

// ejs templating
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// midlleware
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'secret-key',
    rersave: false,
    saveUnitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 + 60 + 60 * 24 *7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser()) // setter
passport.deserializeUser(User.deserializeUser()) // getter
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

// mongodb connected
mongoose.connect('mongodb://127.0.0.1:27017/bestpoint')
    try {
        console.log('Connected to MongoDB')
    } catch (error) {
        console.log(error)
    }

// define routes
const placeRouter = require('./routes/places')
const reviewRouter = require('./routes/reviews')

// define routes
app.use('/places', placeRouter)
app.use('/places/:place_id/reviews', reviewRouter)

app.get('/register', async(req, res) =>{
    const user = new User({
        email: 'user@mail.com',
        username: 'user'
    })

    const newUser = await User.register(user, 'password')
    res.send(newUser)
})


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

