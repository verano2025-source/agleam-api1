// routes/auth.js
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authcontroller');

router.post('/login', login);

module.exports = router;
