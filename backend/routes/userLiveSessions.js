const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getUserSessions } = require('../controllers/liveSessionController');

router.use(authenticate); // Authenticated users only

router.get('/', getUserSessions); // Only if subscribed

module.exports = router;
