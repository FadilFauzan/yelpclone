const express = require('express')
const router = express.Router()

const passport = require('passport')
const wrapAsync = require('../utils/wrapAsync')

// Models
const User = require('../models/user')

// Middleware
const isAuth = require('../middlewares/isAuth')
const isGuest = require('../middlewares/isGuest')


// Routes
router.get('/register', isGuest, (req, res) =>{
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

router.get('/login', isGuest, (req, res) =>{
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

router.post('/logout', isAuth, (req, res) =>{
    req.logout(function (err) {
        if (err) {return next(err)}
        req.flash('success_msg', 'You are logged out')
        res.redirect('/login')
    })
})

module.exports = router