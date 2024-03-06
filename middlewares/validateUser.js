const { userSchema } = require("../schemas/user")
const ErrorHandler = require('../utils/ErrorHandler')

const validateUser = (req, res, next) =>{
    const {error} = userSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ErrorHandler(msg, 400))
    } else {
        return next()
    }
}

module.exports = validateUser