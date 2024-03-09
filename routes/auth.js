const express = require('express')
const router = express.Router()

const passport = require('passport')
const wrapAsync = require('../utils/wrapAsync')

// Controller
const AuthController = require('../controllers/auth')

// Middleware
const validateUser = require('../middlewares/validateUser');
const { Guest } = require('../middlewares/isAuth')
const { Auth } = require('../middlewares/isAuth')

// Routes
router.get('/register', Guest, AuthController.registerForm)

router.post('/register', Guest, validateUser, wrapAsync(AuthController.register))

router.get('/login', Guest, AuthController.loginForm)

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: {
        type: 'error_msg',
        msg: 'Invalid username or password'
    }
}), AuthController.login)

router.post('/logout', Auth, AuthController.logout)

module.exports = router