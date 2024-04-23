const Place = require('../models/place')

module.exports.index = async (req, res) => {
    const places = await Place.find()
    res.render('places/index', { places })
}

module.exports.show = async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)
    .populate({
        path: 'reviews',
        populate: 'author'
    })
    .populate('author')
    res.render('places/show', { place })
}

module.exports.create = (req, res) =>{
    res.render('places/create')
}

module.exports.store = async (req, res) => {
    const images = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }))
    const place = new Place(req.body.place)
    place.author = req.user._id
    place.images = images

    await place.save()

    req.flash('success_msg', 'Place added successfully')
    res.redirect('/places')
}

module.exports.edit = async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)
    res.render('places/edit', { place })
}

module.exports.update = async (req, res) => {
    const { id } = req.params
    await Place.findByIdAndUpdate(id, req.body.place,
        {runValidators: true}
    )
    req.flash('success_msg', 'Place updated successfully')
    res.redirect(`/places/${ id }`)
}

module.exports.destroy = async (req, res) => {
    const { id } = req.params
    await Place.findByIdAndDelete(id)
    req.flash('success_msg', 'Place deleted successfully')
    res.redirect(`/places`)
}