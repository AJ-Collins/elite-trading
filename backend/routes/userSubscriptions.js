const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getUserSubscriptions } = require('../controllers/subscriptionController');

router.use(authenticate); // Authenticated users only

router.get('/:id', getUserSubscriptions); // Only if subscribed

module.exports = router;
