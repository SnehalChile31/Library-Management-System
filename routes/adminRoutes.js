const express = require('express');
const {overDueBooks} = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/overdueBooks',  authenticate, authorizeAdmin, overDueBooks);

module.exports = router;
