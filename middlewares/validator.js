const { placeSchema } = require("../schemas/place")
const { reviewSchema } = require("../schemas/review")
const { userSchema } = require("../schemas/user")

const ErrorHandler = require('../utils/ErrorHandler')

function validateSchema(schema, req, res, next) {
    const { error } = schema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ErrorHandler(msg, 400))
    } else {
        return next()
    }
}

module.exports.validatePlace = (req, res, next) => validateSchema(placeSchema, req, res, next)
module.exports.validateReview = (req, res, next) => validateSchema(reviewSchema, req, res, next)
module.exports.validateUser = (req, res, next) => validateSchema(userSchema, req, res, next)
