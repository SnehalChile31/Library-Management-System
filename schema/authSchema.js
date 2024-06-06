const Joi = require("joi");
const registerSchema = Joi.object().keys({
    email: Joi.string().required(),
    password:  Joi.string().required()
})


const loginSchema = Joi.object().keys({
    email: Joi.string().required(),
    password:  Joi.string().required(),
    isAdmin : Joi.boolean().required()
})

module.exports ={
    registerSchema,
    loginSchema
}