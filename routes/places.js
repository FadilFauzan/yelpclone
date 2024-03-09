const express = require('express')
const router = express.Router()

const wrapAsync = require('../utils/wrapAsync')

// Controller
const PlaceController = require('../controllers/place')

// Middleware
const validatePlace = require('../middlewares/validatePlace');
const isValidObjectId = require('../middlewares/isValidObjectId')
const { Auth } = require('../middlewares/isAuth');
const { isAuthorPlace } = require('../middlewares/isAuthor');

// Routes
router.get('/', wrapAsync(PlaceController.index))

router.get('/create', Auth, PlaceController.create)

router.get('/:id', isValidObjectId('/places'), wrapAsync(PlaceController.show))

router.post('/', Auth, validatePlace, wrapAsync(PlaceController.store))

router.get('/:id/edit', Auth, isAuthorPlace, isValidObjectId(`/places`), wrapAsync(PlaceController.edit))

router.put('/:id', Auth, isAuthorPlace, isValidObjectId(`/places`), validatePlace, wrapAsync(PlaceController.update))

router.delete('/:id', Auth, isAuthorPlace, isValidObjectId(`/places`), wrapAsync(PlaceController.destroy))

module.exports = router