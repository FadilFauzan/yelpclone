const express = require('express')
const router = express.Router()

const passport = require('passport')
const wrapAsync = require('../utils/wrapAsync')

// Models
const User = require('../models/user')

// Middleware
const isValidObjectId = require('../middlewares/isValidObjectId')

// Routes
router.get('/register', (req, res) =>{
    res.render('auth/register')
})

router.post('/register', wrapAsync(async (req, res) =>{
    try {
        const {email, username, password} = req.body
        const user = new User({email, username})
        await User.register(user, password)
        req.flash('success_msg', 'Your are registered and can log in')
        res.redirect('/login')

    } catch (error) {
        req.flash('error_msg', error.message)
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) =>{
    res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: {
        type: 'error_msg',
        msg: 'Invalid username or password'
    }
}), (req, res) =>{
    req.flash('success_msg', 'You are logged in')
    res.redirect('/places')
})

module.exports = router