const { CourseNote, Course } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/notes/',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPEG, PNG, or PowerPoint files are allowed'), false);
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Get all notes
async function getAllNotes(req, res) {
    try {
      const notes = await CourseNote.findAll({
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['title'],
          },
        ],
      });
      res.status(200).json(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  }
  
  // Create a note
  async function createNote(req, res) {
    try {
      const { title, courseId, type, author, access } = req.body;
  
      if (!title || !courseId || !type || !author || !access || !req.file) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ error: 'Title, courseId, type, author, access, and file are required' });
      }
  
      if (!['PDF', 'Image', 'Slides'].includes(type)) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ error: 'Type must be PDF, Image, or Slides' });
      }
  
      if (!['Free', 'Premium'].includes(access)) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ error: 'Access must be Free or Premium' });
      }
  
      const course = await Course.findByPk(courseId);
      if (!course) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ error: 'Invalid courseId' });
      }
  
      const noteData = {
        title,
        courseId: parseInt(courseId),
        type,
        author,
        access,
        source: `/uploads/notes/${req.file.filename}`,
        isLocal: true,
      };
  
      const note = await CourseNote.create(noteData);
      const noteWithCourse = await CourseNote.findByPk(note.id, {
        include: [{ model: Course, as: 'course', attributes: ['title'] }],
      });
  
      res.status(201).json(noteWithCourse);
    } catch (error) {
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Failed to create note' });
    }
  }
  
  // Update a note
  async function updateNote(req, res) {
    try {
      const { id } = req.params;
      const { title, courseId, type, author, access } = req.body;
  
      const note = await CourseNote.findByPk(id);
      if (!note) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(404).json({ error: 'Note not found' });
      }
  
      if (!title || !courseId || !type || !author || !access) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ error: 'Title, courseId, type, author, and access are required' });
      }
  
      if (!['PDF', 'Image', 'Slides'].includes(type)) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ error: 'Type must be PDF, Image, or Slides' });
      }
  
      if (!['Free', 'Premium'].includes(access)) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ error: 'Access must be Free or Premium' });
      }
  
      const course = await Course.findByPk(courseId);
      if (!course) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ error: 'Invalid courseId' });
      }
  
      const updatedData = {
        title,
        courseId: parseInt(courseId),
        type,
        author,
        access,
      };
  
      let oldFilePath = null;
      if (req.file) {
        updatedData.source = `/uploads/notes/${req.file.filename}`;
        updatedData.isLocal = true;
        if (note.isLocal) {
          oldFilePath = path.join(__dirname, '..', note.source);
        }
      }
  
      await note.update(updatedData);
  
      if (oldFilePath) {
        try {
          await fs.unlink(oldFilePath);
        } catch (unlinkError) {
          console.error('Error cleaning up old file:', unlinkError);
        }
      }
  
      const updatedNote = await CourseNote.findByPk(id, {
        include: [{ model: Course, as: 'course', attributes: ['title'] }],
      });
  
      res.status(200).json(updatedNote);
    } catch (error) {
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }
      console.error('Error updating note:', error);
      res.status(500).json({ error: 'Failed to update note' });
    }
  }
  
  // Delete a note
  async function deleteNote(req, res) {
    try {
      const { id } = req.params;
      const note = await CourseNote.findByPk(id);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
  
      let filePath = null;
      if (note.isLocal) {
        filePath = path.join(__dirname, '..', note.source);
      }
  
      await note.destroy();
  
      if (filePath) {
        try {
          await fs.unlink(filePath);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }
  
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ error: 'Failed to delete note' });
    }
  }
  
  module.exports = {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote,
    upload: upload.single('file'),
  };