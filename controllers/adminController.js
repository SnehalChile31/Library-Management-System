const Book = require('../models/book');
const BookBorrowed = require('../models/bookBorrowed');
const User = require('../models/user')
const { Op } = require('sequelize'); 

exports.overDueBooks = async (req, res) => {
    try {
        console.log("inside overdueBooks");
        const today = new Date();
        const overdueBooks = await BookBorrowed.findAll({
        where: {
            book_status: 'borrowed',
            dueDate: {
            [Op.lt]: today
            },
            returnDate: {
            [Op.is]: null
            }

        },
        include: [
            {
            model: Book,
            attributes: ['title', 'author', 'isbn']
            },
            {
            model: User,
            attributes: ['id']
            }
        ]
        });
    
        res.json(overdueBooks);
    
        
    } catch (error) {
        console.log("adminController.js, line no. 47", JSON.stringify(error));
        res.status(500).json({ error });
    }

}