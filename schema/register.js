const Joi = require('joi')
const registerSchema = Joi.object({
    name : Joi.string().min(1),
    username : Joi.string().min(1),
    password : Joi.string().min(8),
    repeatPassword : Joi.ref('password').required();
    avatar : Joi.string(),
    coverImage : Joi.string(),
    email : Joi.string().email(),
    bio : Joi.string(),
})

module.exports = registerSchema;