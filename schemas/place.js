const Joi = require('joi')

module.exports.placeSchema = Joi.object({
    place: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().min(0).required(),
        price: Joi.string().required(),
    }).required()
})

