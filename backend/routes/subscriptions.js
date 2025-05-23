const express = require('express');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');
const authenticate = require('../middleware/auth');

const subscriptionController = require('../controllers/subscriptionController');
const { getPublicSubscriptions, subscribeUser, getAllSubscriptions, createSubscription, updateSubscription, deleteSubscription } = require('../controllers/subscriptionController');

// Publicly accessible route
router.get('/public', getPublicSubscriptions);

// Authenticated user route for subscribing to a plan
router.post('/subscribe', authenticate, subscribeUser);

// Admin-only routes
router.use(authenticate, isAdmin);

router.get('/', getAllSubscriptions);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.delete('/:id', deleteSubscription);

module.exports = router;
