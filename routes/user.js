const express = require('express')
const router = express.Router()

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
        await User.register(user, 'password')
        req.flash('success_msg', 'Your are registered and can log in')
        res.redirect('/places')

    } catch (error) {
        req.flash('error_msg', error.message)
        res.redirect('/register')
    }
}))

module.exports = router