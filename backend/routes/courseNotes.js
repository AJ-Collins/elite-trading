const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const authenticate = require('../middleware/auth'); 
const { getAllNotes, createNote, updateNote, deleteNote, upload } = require('../controllers/courseNotesController');
const { route } = require('./adminUserRoutes');

router.use(authenticate, isAdmin);

const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads/notes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.get('/', getAllNotes);
router.post('/', upload, createNote);
router.put('/:id', upload, updateNote);
router.delete('/:id', deleteNote);

module.exports = router;