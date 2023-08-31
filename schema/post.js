const Joi = require('joi')
const postSchema = Joi.object({
    postImages : Joi.array().items(Joi.string()),
    postData : Joi.string().required(),
    
})

module.exports = postSchema;