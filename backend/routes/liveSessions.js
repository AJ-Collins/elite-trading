const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const authenticate = require('../middleware/auth'); 
const { 
  createLiveSession, 
  getLiveSessions, 
  getLiveSessionById, 
  updateLiveSession, 
  deleteLiveSession,
} = require('../controllers/liveSessionController');

// Multer setup (you can move this to a separate file if preferred)
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/thumbnails/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
router.use(authenticate, isAdmin);
// Routes
router.post('/', upload.single('thumbnail'), createLiveSession); // Handle thumbnail upload
router.get('/', getLiveSessions);
router.get('/:id', getLiveSessionById);
router.put('/:id', upload.single('thumbnail'), updateLiveSession); // Handle thumbnail upload
router.delete('/:id', deleteLiveSession);

module.exports = router;