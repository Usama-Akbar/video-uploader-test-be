const express = require('express');
const { registerUser,login, createBio } = require('../controller/user.controller');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login',login)
router.post('/bio',verifyToken,createBio)
module.exports = router;