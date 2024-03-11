const express = require('express')
const router = express.Router()

const passport = require('passport')
const wrapAsync = require('../utils/wrapAsync')

// Controller
const AuthController = require('../controllers/auth')

// Middleware
const { validateUser } = require('../middlewares/validator');
const { Guest } = require('../middlewares/isAuth')
const { Auth } = require('../middlewares/isAuth')

// Routes
router.route('/register')
    .get(Guest, AuthController.registerForm)
    .post( Guest, validateUser, wrapAsync(AuthController.register))

router.route('/login')
    .get(Guest, AuthController.loginForm)
    .post(passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: {
        type: 'error_msg',
        msg: 'Invalid username or password'
    }
}), AuthController.login)

router.post('/logout', Auth, AuthController.logout)

module.exports = router