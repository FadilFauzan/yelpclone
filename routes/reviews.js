const express = require('express')
const router = express.Router({mergeParams: true})

const wrapAsync = require('../utils/wrapAsync')
const ErrorHandler = require('../utils/ErrorHandler')

// Models
const Review = require('../models/review')
const Place = require('../models/place')
// Middleware
const validateReview = require('../middlewares/validateReview');
const isValidObjectId = require('../middlewares/isValidObjectId')

// Routes
router.post('/', isValidObjectId(`/places`), validateReview, wrapAsync(async (req, res)  =>{
    const {place_id} = req.params
    const review = new Review(req.body.review)
    const place = await Place.findById(place_id)
    place.reviews.push(review)
    review.save()
    place.save()
    req.flash('success_msg', 'Review added successfully')
    res.redirect(`/places/${place_id}`)
}))

router.delete('/:review_id', isValidObjectId(`/places`), wrapAsync(async (req, res) =>{
    const {place_id, review_id} = req.params
    await Place.findByIdAndUpdate(place_id, {$pull: {reviews: review_id}}) 
    await Review.findByIdAndDelete(review_id)
    req.flash('success_msg', 'Review deleted successfully')
    res.redirect(`/places/${place_id}`)
}))

module.exports = router