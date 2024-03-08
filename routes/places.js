const express = require('express')
const router = express.Router()

const wrapAsync = require('../utils/wrapAsync')

// Models
const Place = require('../models/place')

// Middleware
const validatePlace = require('../middlewares/validatePlace');
const isValidObjectId = require('../middlewares/isValidObjectId')
const isAuth = require('../middlewares/isAuth');
const { isAuthorPlace } = require('../middlewares/isAuthor');

// Routes
router.get('/', wrapAsync(async (req, res) =>{
    const places = await Place.find()
    res.render('places/index', {places})
}))

router.get('/create', isAuth, (req, res) =>{
    res.render('places/create')
})

router.get('/:id', isValidObjectId('/places'), wrapAsync(async (req, res) =>{
    const {id} = req.params
    const place = await Place.findById(id).populate('reviews').populate('author')
    res.render('places/show', {place})
}))

router.post('/', isAuth, validatePlace, wrapAsync(async (req, res) =>{
    const place = new Place(req.body.place)
    place.save()
    req.flash('success_msg', 'Place added successfully')
    res.redirect('/places')
}))

router.get('/:id/edit', isAuth, isAuthorPlace, isValidObjectId(`/places`), wrapAsync(async (req, res) =>{
    const {id} = req.params
    const place = await Place.findById(id)
    res.render('places/edit', {place})
}))

router.put('/:id', isAuth, isAuthorPlace, isValidObjectId(`/places`), validatePlace, wrapAsync(async (req, res) =>{
    const {id} = req.params
    await Place.findByIdAndUpdate(id, req.body.place,
        {runValidators: true}
    )
    req.flash('success_msg', 'Place updated successfully')
    res.redirect(`/places/${id}`)
}))

router.delete('/:id', isAuth, isAuthorPlace, isValidObjectId(`/places`), wrapAsync(async (req, res) =>{
    const {id} = req.params
    await Place.findByIdAndDelete(id)
    req.flash('success_msg', 'Place deleted successfully')
    res.redirect(`/places`)
}))

module.exports = router