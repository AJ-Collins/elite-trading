const express = require('express');
const { register, login, getUsetById } = require('../controllers/authController');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/:id', authenticateToken, getUsetById);

module.exports = router;