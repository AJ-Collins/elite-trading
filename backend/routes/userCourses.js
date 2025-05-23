const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getUserCourses } = require('../controllers/coursesController');

router.use(authenticate); // Authenticated users only

router.get('/:id', getUserCourses); // Only if subscribed

module.exports = router;
