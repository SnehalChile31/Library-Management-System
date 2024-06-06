const Joi = require("joi");
const addBookSchema = Joi.object().keys({
    title: Joi.string().required(),
    author: Joi.string().required(),
    isbn: Joi.string().required(),
    publicationYear: Joi.number(),
    actualQuantity: Joi.number().required(),
    currentQuantity: Joi.number().required()
})

const updateBookSchema = Joi.object().keys({
    title: Joi.string(),
    author: Joi.string(),
    isbn: Joi.string(),
    publicationYear: Joi.number(),
    actualQuantity: Joi.number(),
    currentQuantity: Joi.number(),
})

const borrowBookSchema = Joi.object().keys({
    user_id: Joi.number(),
    book_id: Joi.number().required(),
    borrow_date : Joi.date(),
    due_date: Joi.date().required(),
    book_status: Joi.string().allow("borrowed", "returned")
})


module.exports = {
    addBookSchema,
    updateBookSchema,
    borrowBookSchema
};
