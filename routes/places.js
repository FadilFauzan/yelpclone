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
    // .post(Auth, validatePlace, wrapAsync(PlaceController.store))
    .post(Auth, upload.array('image', 5), (req, res) => {
        console.log(req.files)
        console.log(req.body)
        res.send('it works')
    })

router.get('/create', Auth, PlaceController.create)

router.route('/:id')
    .get(isValidObjectId('/places'), wrapAsync(PlaceController.show))
    .put(Auth, isAuthorPlace, isValidObjectId(`/places`), validatePlace, wrapAsync(PlaceController.update))
    .delete(Auth, isAuthorPlace, isValidObjectId(`/places`), wrapAsync(PlaceController.destroy))

router.get('/:id/edit', Auth, isAuthorPlace, isValidObjectId(`/places`), wrapAsync(PlaceController.edit))

module.exports = router