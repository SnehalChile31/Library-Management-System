const Book = require('../models/book');
const {addBookSchema, updateBookSchema} = require('../schema/bookSchema')

exports.addBook = async (req, res) => {
  try {
    console.log("inside addBook", req.body);
    //schema validation
    let validation = addBookSchema.validate(req.body);
    if (validation.error) {
        console.log('requestBody is invalid', validation.error);
        return res.status(400).json({ errors: validation.error });
    }

    const { title, author, isbn, publicationYear, actualQuantity, currentQuantity } = req.body;
    const updatedBy = req.user.id;
    const createdBy = req.user.id; 

    const book = await Book.create({ title, author, isbn, publicationYear, actualQuantity, currentQuantity, createdBy, updatedBy });
    console.log("bookController line no. 13", book);

    res.status(201).json({id: book.id, message: "book added successfully"});
  } catch (err) {
    console.log("bookController.js, line no. 24", JSON.stringify(err));
    res.status(500).json({ error: err });
  }
};

exports.updateBook = async (req, res) => {
  try {
    console.log("inside updateBook, req.body",req.body);
    const { id } = req.params;
    const { title, author, isbn, publicationYear, actualQuantity, currentQuantity } = req.body; 

    //schema validation
    let validation = updateBookSchema.validate(req.body);
    if (validation.error) {
        console.log('requestBody is invalid', validation.error);
        return res.status(400).json({ errors: validation.error });
    }

   
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    book.title = title;
    book.author = author;
    book.isbn = isbn;
    book.publicationYear = publicationYear;
    book.actualQuantity = actualQuantity;
    book.currentQuantity = currentQuantity;
    book.updatedBy = req.user.id;
    
    const output = await book.save();
    console.log("bookController line no. 55", output);
    res.json({ id : book.id, message: 'Book data updated' });

  } catch (err) {
    console.log("bookController.js, line no. 62", JSON.stringify(err));
    res.status(500).json({ error: err });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findOne({ where: { id, is_deleted : 1 }});
    console.log("book -------->", );
    if (!book || book?.dataValues?.is_deleted) {
      return res.status(404).json({ error: 'Book not found' });
    }
    book.is_deleted = 1;
    await book.save();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    console.log("bookController.js, line no. 81", JSON.stringify(err));
    res.status(500).json({ error: err });
  }
};
