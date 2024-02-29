const { reviewSchema } = require("../schemas/review")
const ErrorHandler = require('../utils/ErrorHandler')

const validatePlace = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ErrorHandler(msg, 400))
    } else {
        return next()
    }
}

module.exports = validatePlace