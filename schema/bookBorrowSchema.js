const Joi = require("joi");
const borrowBookSchema = Joi.object().keys({
    bookId: Joi.number().required(),
    dueDate:  Joi.date().required()
})


module.exports ={
    borrowBookSchema
}