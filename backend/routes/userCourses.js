const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getUserFreeCourses, getUserPremiumCourses, getUserLiveSessions } = require('../controllers/userCoursesController');

router.use(authenticate); // Authenticated users only

router.get('/free', getUserFreeCourses); // Free courses
router.get('/premium/:id', getUserPremiumCourses); // Free courses
router.get('/live/sessions/:id', getUserLiveSessions); //Live sessions

module.exports = router;
