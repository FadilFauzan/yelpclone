const express = require('express')
const router = express.Router({mergeParams: true})

const wrapAsync = require('../utils/wrapAsync')

// Controller
const ReviewController = require('../controllers/review')

// Middleware
const { validateReview } = require('../middlewares/validator');
const isValidObjectId = require('../middlewares/isValidObjectId')
const { Auth } = require('../middlewares/isAuth')
const { isAuthorReview } = require('../middlewares/isAuthor');

// Routes
router.post('/', Auth, isValidObjectId(`/places`), validateReview, wrapAsync(ReviewController.store))

router.delete('/:review_id', Auth, isAuthorReview, isValidObjectId(`/places`), wrapAsync(ReviewController.destroy))

module.exports = router