const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const authenticate = require('../middleware/auth'); 
const { getAllCourses, createCourses, updateCourse, deleteCourse } = require('../controllers/coursesController');
const { route } = require('./adminUserRoutes');

router.use(authenticate, isAdmin);

router.get('/', getAllCourses);
router.post('/', createCourses);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;