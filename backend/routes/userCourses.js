const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getUserFreeCourses, getUserPremiumCourses, getUserLiveSessions, archiveCourse, getArchivedCourses, unArchiveCourse } = require('../controllers/userCoursesController');

router.use(authenticate); // Authenticated users only

router.get('/free', getUserFreeCourses); // Free courses
router.get('/premium/:id', getUserPremiumCourses); // Free courses
router.get('/live/sessions/:id', getUserLiveSessions); //Live sessions
router.get('/archive', getArchivedCourses); //Get archived courses
router.post('/archive', archiveCourse); //Archive course
router.post('/unarchive', unArchiveCourse); //Unarchive course
// router.post('/mark-complete', markVideoCompleteCourse); //Unarchive course

module.exports = router;
