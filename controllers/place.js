const Place = require('../models/place')
const fs = require('fs')

const ErrorHandler = require('../utils/ErrorHandler')
const { geometry } = require('../utils/hereMaps')

module.exports.index = async (req, res) => {
    const places = await Place.find()
    res.render('places/index', { 
        places, 
        title: 'All Places',
        active: 'place'
    })
}

module.exports.show = async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)
    .populate({
        path: 'reviews',
        populate: 'author'
    })
    .populate('author')
    const apiKey = process.env.API_KEY;
    res.render('places/show', { 
        place, 
        apiKey, 
        title: 'Show Place',
        active: 'place'
    })
}

module.exports.create = (req, res) =>{
    const active = 'new_place'
    const title = 'New Place'
    res.render('places/create', { 
        active, title
    })
}

module.exports.store = async (req, res) => {
    const images = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }))

    const geoData = await geometry(req.body.place.location)

    const place = new Place(req.body.place)
    place.author = req.user._id
    place.images = images
    place.geometry = geoData

    await place.save()

    req.flash('success_msg', 'Place added successfully')
    res.redirect('/places')
}

module.exports.edit = async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)
    res.render('places/edit', { 
        place, 
        title: 'Edit Place',
        active: 'place'
    })
}

module.exports.update = async (req, res) => {
    const { id } = req.params
    const place = await Place.findByIdAndUpdate(id, {...req.body.place})

    if (req.files && req.files.length > 0) {
        place.images.forEach(image => {
            fs.unlink(image.url , err => new ErrorHandler(err))
        })

        const images = req.files.map(file => ({
            url: file.path,
            filename: file.filename
        }))

        place.images = images
        await place.save()
    }

    req.flash('success_msg', 'Place updated successfully')
    res.redirect(`/places/${ id }`)
}

module.exports.destroy = async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)

    if (place.images.length > 0) {
        place.images.forEach(image => {
            fs.unlink(image.url , err => new ErrorHandler(err))
        })
    }

    await place.deleteOne()

    req.flash('success_msg', 'Place deleted successfully')
    res.redirect(`/places`)
}

module.exports.destroyImage = async (req, res) => {
    try {
        const { id } = req.params
        const { images } = req.body

        const place = await Place.findById(id);
        if (!place) {
            req.flash('error_msg', 'Place not found');
            return res.redirect(`/places/${id}/edit`);
        }

        if (!images || images.length === 0) {
            req.flash('error_msg', 'Please select at least one image')
            return res.redirect(`/places/${id}/edit`)
        }

        const remainingImages = place.images.length - images.length
        if (remainingImages <= 0) {
            req.flash('error_msg', 'Please at least pin or add one photo to your post');
            return res.redirect(`/places/${id}/edit`);
        }

        images.forEach(image => {
            fs.unlinkSync(image)
        })

        await Place.findByIdAndUpdate(
            id, { $pull: { images: { url: { $in: images } } } }
        )

        req.flash('success_msg', 'Successfully deleted images')
        return res.redirect(`/places/${id}/edit`)

    } catch (error) {
        req.flash('error_msg', 'Failed to delete image')
        return res.redirect(`/places/${id}/edit`)
    }
}