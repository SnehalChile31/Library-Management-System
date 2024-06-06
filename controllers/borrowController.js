const BookBorrowed = require('../models/bookBorrowed');
const Book = require('../models/book');
const {borrowBookSchema} = require('../schema/bookBorrowSchema')
exports.borrowBook = async (req, res) => {
  try {
    //schema validation
    let validation = borrowBookSchema.validate(req.body);
    if (validation.error) {
        console.log('requestBody is invalid', validation.error);
        return res.status(400).json({ errors: validation.error });
    }

    const { bookId, dueDate } = req.body;
    const userId = req.user.id;

    // checking book is available or not
    const book = await Book.findByPk(bookId);
    if (!book || book.currentQuantity <= 0 || book.is_deleted == 1 ) {
      return res.status(400).json({ error: 'Book is not available' });
    }

    //user can not by same book
    const sameBook = await BookBorrowed.findOne({where : {userId, bookId, book_status : 'borrowed' }});
    console.log("sameBook",sameBook);

    if(!sameBook){
      const borrowedBook = await BookBorrowed.create({ userId, bookId, dueDate });
      book.currentQuantity -= 1;  
      await book.save();
      res.status(201).json({id: borrowedBook.title, message: "Book borrowed successfully"});
    }else{
      return res.status(400).json({ error: 'You already borrowd same book' });

    }

  } catch (err) {
    console.log("borrowController.js, line no. 24", JSON.stringify(err));
    res.status(500).json({ error: err });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const borrowedBook = await BookBorrowed.findByPk(id);

    if (!borrowedBook) {
      return res.status(404).json({ error: 'Record not found' });
    }

    if (borrowedBook.returnDate) {
      return res.status(400).json({ error: 'Book already returned' });
    }

    borrowedBook.returnDate = new Date();
    borrowedBook.book_status = 'returned'
    await borrowedBook.save();

    const book = await Book.findByPk(borrowedBook.bookId);
    book.currentQuantity += 1;
    await book.save();

    res.status(201).json({id: borrowedBook.title, message: "Book returned successfully"});
  } catch (err) {
    console.log("borrowController.js, line no. 24", JSON.stringify(err));
    res.status(500).json({ error: err });
  }
};
