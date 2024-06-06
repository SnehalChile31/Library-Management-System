const express = require('express');
const {borrowBook,returnBook} = require('../controllers/borrowController');
const { authenticate, authorizeUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, authorizeUser, borrowBook);

router.post('/return/:id', authenticate, authorizeUser, returnBook);

module.exports = router;
