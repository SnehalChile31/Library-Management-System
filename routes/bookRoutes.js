const express = require('express');
const {addBook, updateBook, deleteBook} = require('../controllers/bookController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/addBook', authenticate, authorizeAdmin, addBook);

router.post('/update/:id', authenticate,authorizeAdmin,updateBook);

router.post('/delete/:id', authenticate, authorizeAdmin, deleteBook);

module.exports = router;

