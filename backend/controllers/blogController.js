const { Blog, Course } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: 'uploads/blogs/',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, or GIF images are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Get all blogs
async function getAllBlogs(req, res) {
  try {
    const blogs = await Blog.findAll({
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['title'],
          required: false,
        },
      ],
    });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
}

// Create a blog
async function createBlog(req, res) {
  try {
    const { title, excerpt, author, category, status, courseId } = req.body;

    if (!title || !author || !status) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Title, author, and status are required' });
    }

    if (!['Active', 'Locked'].includes(status)) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Status must be Active or Locked' });
    }

    if (courseId) {
      const course = await Course.findByPk(courseId);
      if (!course) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ error: 'Invalid courseId' });
      }
    }

    const blogData = {
      title,
      excerpt: excerpt || null,
      author,
      category: category || null,
      status,
      reported: false,
      views: 0,
      comments: 0,
      courseId: courseId ? parseInt(courseId) : null,
    };

    if (req.file) {
      blogData.image = `/uploads/blogs/${req.file.filename}`;
      blogData.isLocalImage = true;
    } else {
      blogData.image = null;
      blogData.isLocalImage = false;
    }

    const blog = await Blog.create(blogData);
    const blogWithCourse = await Blog.findByPk(blog.id, {
      include: [{ model: Course, as: 'course', attributes: ['title'], required: false }],
    });

    res.status(201).json(blogWithCourse);
  } catch (error) {
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
}

// Update a blog
async function updateBlog(req, res) {
  try {
    const { id } = req.params;
    const { title, excerpt, author, category, status, courseId } = req.body;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (!title || !author || !status) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Title, author, and status are required' });
    }

    if (!['Active', 'Locked'].includes(status)) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Status must be Active or Locked' });
    }

    if (courseId) {
      const course = await Course.findByPk(courseId);
      if (!course) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ error: 'Invalid courseId' });
      }
    }

    const updatedData = {
      title,
      excerpt: excerpt || null,
      author,
      category: category || null,
      status,
      courseId: courseId ? parseInt(courseId) : null,
    };

    let oldFilePath = null;
    if (req.file) {
      updatedData.image = `/uploads/blogs/${req.file.filename}`;
      updatedData.isLocalImage = true;
      if (blog.isLocalImage && blog.image) {
        oldFilePath = path.join(__dirname, '..', blog.image);
      }
    }

    await blog.update(updatedData);

    if (oldFilePath) {
      try {
        await fs.unlink(oldFilePath);
      } catch (unlinkError) {
        console.error('Error cleaning up old file:', unlinkError);
      }
    }

    const updatedBlog = await Blog.findByPk(id, {
      include: [{ model: Course, as: 'course', attributes: ['title'], required: false }],
    });

    res.status(200).json(updatedBlog);
  } catch (error) {
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
}

// Delete a blog
async function deleteBlog(req, res) {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    let filePath = null;
    if (blog.isLocalImage && blog.image) {
      filePath = path.join(__dirname, '..', blog.image);
    }

    await blog.destroy();

    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
}

// Toggle reported status
async function toggleReported(req, res) {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    await blog.update({ reported: !blog.reported });

    const updatedBlog = await Blog.findByPk(id, {
      include: [{ model: Course, as: 'course', attributes: ['title'], required: false }],
    });

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error toggling reported status:', error);
    res.status(500).json({ error: 'Failed to toggle reported status' });
  }
}

async function findAll(req, res) {
  try {
    const blogs = await Blog.findAll({
      where: { status: 'Active' },
      include: [{ model: Course, as: 'course', attributes: ['title'], required: false }],
    });

    const formattedBlogs = blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      excerpt: blog.excerpt || '',
      author: blog.author,
      date: new Date(blog.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      image: blog.image || '/images/placeholder.jpg',
      category: blog.category || '',
      courseTitle: blog.course?.title || '', // Optional: to include the course title
    }));

    res.status(200).json(formattedBlogs);
  } catch (error) {
    console.error('Error fetching public blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
}


module.exports = {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleReported,
  upload: upload.single('image'),
  findAll
};