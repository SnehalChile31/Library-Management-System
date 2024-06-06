const express = require('express');
const {register, login} = require('../controllers/authController');
const router = express.Router();

router.post('/register/user', register);

router.post('/register/admin',register);

router.post('/login',login);

module.exports = router;
