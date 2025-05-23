const { CourseVideo, Course } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/videos/',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit (adjust as needed)
});

// Get all videos
async function getAllVideos(req, res) {
  try {
    const videos = await CourseVideo.findAll({
      include: [
        {
          model: Course,
          attributes: ['title'], // Only include course title
        },
      ],
    });
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
}

// Create a video
async function createVideo(req, res) {
  try {
    const { title, courseId, access, source } = req.body;

    // Validate required fields
    if (!title || !courseId || !access || (!req.file && !source)) {
      if (req.file) {
        // Clean up uploaded file if validation fails
        await fs.unlink(req.file.path);
      }
      return res.status(400).json({ error: 'Title, courseId, access, and either video file or source URL are required' });
    }

    // Validate access
    if (!['Free', 'Premium'].includes(access)) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Access must be Free or Premium' });
    }

    // Validate courseId
    const course = await Course.findByPk(courseId);
    if (!course) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Invalid courseId' });
    }

    const videoData = {
      title,
      courseId: parseInt(courseId),
      access,
      views: 0,
      order: null, // Optional: Set if frontend starts sending order
    };

    if (req.file) {
      // File upload
      videoData.source = `/uploads/videos/${req.file.filename}`;
      videoData.isLocal = true;
    } else {
      // URL
      // Basic URL validation (optional, enhance as needed)
      if (!source.match(/^https?:\/\/.+/)) {
        return res.status(400).json({ error: 'Invalid source URL' });
      }
      videoData.source = source;
      videoData.isLocal = false;
    }

    const video = await CourseVideo.create(videoData);
    const videoWithCourse = await CourseVideo.findByPk(video.id, {
      include: [{ model: Course, attributes: ['title'] }],
    });

    res.status(201).json(videoWithCourse);
  } catch (error) {
    if (req.file) {
      // Clean up file on error
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }
    console.error('Error creating video:', error);
    res.status(500).json({ error: 'Failed to create video' });
  }
}

// Update a video
async function updateVideo(req, res) {
  try {
    const { id } = req.params;
    const { title, courseId, access, source } = req.body;

    const video = await CourseVideo.findByPk(id);
    if (!video) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(404).json({ error: 'Video not found' });
    }

    // Validate required fields
    if (!title || !courseId || !access) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Title, courseId, and access are required' });
    }

    // Validate access
    if (!['Free', 'Premium'].includes(access)) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Access must be Free or Premium' });
    }

    // Validate courseId
    const course = await Course.findByPk(courseId);
    if (!course) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Invalid courseId' });
    }

    const updatedData = {
      title,
      courseId: parseInt(courseId),
      access,
    };

    let oldFilePath = null;
    if (req.file) {
      // New file upload
      updatedData.source = `/uploads/videos/${req.file.filename}`;
      updatedData.isLocal = true;
      if (video.isLocal) {
        oldFilePath = path.join(__dirname, '..', video.source); // Store old file path for cleanup
      }
    } else if (source) {
      // New URL
      if (!source.match(/^https?:\/\/.+/)) {
        return res.status(400).json({ error: 'Invalid source URL' });
      }
      updatedData.source = source;
      updatedData.isLocal = false;
      if (video.isLocal) {
        oldFilePath = path.join(__dirname, '..', video.source); // Store old file path for cleanup
      }
    }

    await video.update(updatedData);

    // Clean up old file if it was replaced
    if (oldFilePath) {
      try {
        await fs.unlink(oldFilePath);
      } catch (unlinkError) {
        console.error('Error cleaning up old file:', unlinkError);
      }
    }

    const updatedVideo = await CourseVideo.findByPk(id, {
      include: [{ model: Course, attributes: ['title'] }],
    });

    res.status(200).json(updatedVideo);
  } catch (error) {
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
}

// Delete a video
async function deleteVideos(req, res) {
  try {
    const { id } = req.params;
    const video = await CourseVideo.findByPk(id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    let filePath = null;
    if (video.isLocal) {
      filePath = path.join(__dirname, '..', video.source);
    }

    await video.destroy();

    // Clean up file if it was local
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
}

module.exports = {
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideos,
  upload: upload.single('video'), // Middleware for file uploads
};