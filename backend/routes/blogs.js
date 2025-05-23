const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const authenticate = require('../middleware/auth'); 
const { route } = require('./adminUserRoutes');

const { getAllBlogs, createBlog, updateBlog, deleteBlog, toggleReported, upload, findAll } = require('../controllers/blogController');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads/blogs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.get('/public', findAll);

router.use(authenticate, isAdmin);

router.get('/', getAllBlogs);
router.post('/', upload, createBlog);
router.put('/:id', upload, updateBlog);
router.delete('/:id', deleteBlog);
router.patch('/:id/reported', toggleReported);


module.exports = router;