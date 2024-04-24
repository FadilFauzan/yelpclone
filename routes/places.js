const express = require('express')
const router = express.Router()

const wrapAsync = require('../utils/wrapAsync')
const upload = require('../config/multer')

// Controller
const PlaceController = require('../controllers/place')

// Middleware
const { validatePlace } = require('../middlewares/validator');
const isValidObjectId = require('../middlewares/isValidObjectId')
const { Auth } = require('../middlewares/isAuth');
const { isAuthorPlace } = require('../middlewares/isAuthor');

// Routes
router.route('/')
    .get(wrapAsync(PlaceController.index))
    .post(Auth, upload.array('image', 5), validatePlace, wrapAsync(PlaceController.store))

router.get('/create', Auth, PlaceController.create)

router.route('/:id')
    .get(isValidObjectId('/places'), wrapAsync(PlaceController.show))
    .put(Auth, isAuthorPlace, isValidObjectId(`/places`), upload.array('image', 5), validatePlace, wrapAsync(PlaceController.update))
    .delete(Auth, isAuthorPlace, isValidObjectId(`/places`), wrapAsync(PlaceController.destroy))

router.get('/:id/edit', Auth, isAuthorPlace, isValidObjectId(`/places`), wrapAsync(PlaceController.edit))
router.delete('/:id/images', Auth, isAuthorPlace, isValidObjectId(`/places`), wrapAsync(PlaceController.destroyImage))

module.exports = router