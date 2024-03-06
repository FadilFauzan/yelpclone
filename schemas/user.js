const Joi = require('joi');

module.exports.userSchema = Joi.object({
    username: Joi.string().max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
}).required()
