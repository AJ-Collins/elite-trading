const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const authenticate = require('../middleware/auth'); 
const { getAllVideos, createVideo, updateVideo, deleteVideos, upload } = require('../controllers/videosController');
const { route } = require('./adminUserRoutes');

router.use(authenticate, isAdmin);


// Ensure uploads/videos directory exists
const fs = require('fs');
const path = require('path');
const uploadDir = path.join(__dirname, '../uploads/videos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.get('/', getAllVideos);
router.post('/', upload, createVideo);
router.put('/:id', upload, updateVideo);
router.delete('/:id', deleteVideos);

module.exports = router;