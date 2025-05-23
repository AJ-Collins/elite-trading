const { Course, Subscription, CourseVideo, CourseNote, ArchivedCourse, User } = require('../models');
const { sequelize } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/thumbnails');
    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png, gif) are allowed!'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single('thumbnail');

async function getAllCourses(req, res) {
    try {
      const courses = await Course.findAll({
        include: [
          { model: Subscription },
          { model: CourseVideo },
          { model: CourseNote },
          {
            model: User,
            as: 'ArchivedByUsers',
            through: { attributes: [] } // exclude pivot table data
          }
        ]
      });
  
      res.status(200).json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  }
  
  // CREATE a new course
  async function createCourses(req, res) {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: err.message });
      }
  
      try {
        const {
          title,
          description,
          publishedWhen,
          author,
          level,
          subscriptionId,
        } = req.body;
  
        const thumbnail = req.file ? `/uploads/thumbnails/${req.file.filename}` : null;
  
        const newCourse = await Course.create({
          title,
          description,
          thumbnail,
          publishedWhen,
          author,
          level,
          subscriptionId,
        });
  
        res.status(201).json(newCourse);
      } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Failed to create course' });
      }
    });
  }
  
  // UPDATE a course
  async function updateCourse(req, res) {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: err.message });
      }
  
      try {
        const courseId = req.params.id;
        const course = await Course.findByPk(courseId);
        if (!course) {
          return res.status(404).json({ message: 'Course not found' });
        }
  
        const {
          title,
          description,
          publishedWhen,
          author,
          level,
          subscriptionId,
        } = req.body;
  
        // If a new thumbnail is uploaded, delete the old one and update the path
        let thumbnail = course.thumbnail;
        if (req.file) {
          // Delete the old thumbnail file if it exists
          if (thumbnail) {
            const oldThumbnailPath = path.join(__dirname, '..', thumbnail);
            if (fs.existsSync(oldThumbnailPath)) {
              fs.unlinkSync(oldThumbnailPath);
            }
          }
          thumbnail = `/uploads/thumbnails/${req.file.filename}`;
        }
  
        await course.update({
          title,
          description,
          thumbnail,
          publishedWhen,
          author,
          level,
          subscriptionId,
        });
  
        res.status(200).json(course);
      } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Failed to update course' });
      }
    });
  }
  
  // DELETE a course
  async function deleteCourse(req, res) {
    try {
      const courseId = req.params.id;
  
      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Delete the thumbnail file if it exists
      if (course.thumbnail) {
        const thumbnailPath = path.join(__dirname, '..', course.thumbnail);
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
        }
      }
  
      await course.destroy();
  
      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ message: 'Failed to delete course' });
    }
  }

  // GET user courses (based on active subscriptions)
  async function getUserCourses(req, res) {
    try {
      // Optional: You can still get the user if needed
      const userId = req.params.id;
  
      const courses = await Course.findAll({
        include: [
          { model: Subscription },
          { model: CourseVideo },
          { model: CourseNote }
        ]
      });
  
      return res.status(200).json(courses);
  
    } catch (error) {
      console.error('Error fetching user courses:', error);
      res.status(500).json({ message: 'Failed to fetch user courses' });
    }
  }
  
  // async function getUserCourses(req, res) {
  //   try {
  //     const userId = req.params.id;

  //     // Step 1: Get all active subscriptions for the user
  //     const userWithSubscriptions = await User.findByPk(userId, {
  //       include: {
  //         model: Subscription,
  //         through: { where: { isActive: true } }, // Only active subscriptions
  //       }
  //     });

  //     if (!userWithSubscriptions || userWithSubscriptions.Subscriptions.length === 0) {
  //       return res.status(200).json([]); // No access
  //     }

  //     const activeSubscriptionIds = userWithSubscriptions.Subscriptions.map(sub => sub.id);

  //     // Step 2: Get all courses under those subscriptions
  //     const courses = await Course.findAll({
  //       where: {
  //         subscriptionId: activeSubscriptionIds
  //       },
  //       include: [
  //         { model: Subscription },
  //         { model: CourseVideo },
  //         { model: CourseNote }
  //       ]
  //     });

  //     return res.status(200).json(courses);

  //   } catch (error) {
  //     console.error('Error fetching user courses:', error);
  //     res.status(500).json({ message: 'Failed to fetch user courses' });
  //   }
  // }

module.exports = {
    getAllCourses,
    createCourses, 
    updateCourse,
    deleteCourse,
    getUserCourses,
};