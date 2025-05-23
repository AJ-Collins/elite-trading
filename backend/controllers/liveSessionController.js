const { LiveSession, User, Subscription } = require('../models');
const { Op } = require('sequelize');

// Create a new live session
exports.createLiveSession = async (req, res) => {
  try {
    const { title, description, startTime, link, instructorId, subscriptionIds } = req.body;
    
    // Handle thumbnail upload (from multer)
    const thumbnail = req.file ? `/uploads/thumbnails/${req.file.filename}` : null;

    // Validate required fields
    if (!title || !startTime || !link || !instructorId) {
      return res.status(400).json({
        success: false,
        message: 'Title, start time, link, and instructor are required',
      });
    }

    // Validate subscriptionIds if provided
    let subscriptions = [];
    if (subscriptionIds) {
      // Parse subscriptionIds if sent as a JSON string (common with multipart/form-data)
      const parsedSubscriptionIds = Array.isArray(subscriptionIds)
        ? subscriptionIds
        : JSON.parse(subscriptionIds || '[]');

      if (parsedSubscriptionIds.length > 0) {
        subscriptions = await Subscription.findAll({
          where: { id: { [Op.in]: parsedSubscriptionIds } },
        });
        if (subscriptions.length !== parsedSubscriptionIds.length) {
          return res.status(400).json({
            success: false,
            message: 'One or more subscription IDs are invalid',
          });
        }
      }
    }

    // Create the live session
    const session = await LiveSession.create({
      title,
      description,
      startTime,
      link,
      thumbnail,
      instructorId,
    });

    // Associate subscriptions if provided
    if (subscriptions.length > 0) {
      await session.setSubscriptions(subscriptions);
    }

    // Fetch the created session with associations for the response
    const createdSession = await LiveSession.findByPk(session.id, {
      include: [
        { model: User, as: 'instructor', attributes: ['id', 'username', 'email'] },
        { model: Subscription, as: 'subscriptions', attributes: ['id', 'type'], through: { attributes: [] } },
      ],
    });

    res.status(201).json({ success: true, data: createdSession });
  } catch (error) {
    console.error('Error creating live session:', error);
    res.status(500).json({ success: false, message: 'Failed to create live session' });
  }
};

// Update a live session
exports.updateLiveSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startTime, link, instructorId, subscriptionIds } = req.body;
    
    // Handle thumbnail upload (from multer)
    const thumbnail = req.file ? `/uploads/thumbnails/${req.file.filename}` : undefined;

    const session = await LiveSession.findByPk(id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Live session not found' });
    }

    // Validate required fields
    if (!title || !startTime || !link || !instructorId) {
      return res.status(400).json({
        success: false,
        message: 'Title, start time, link, and instructor are required',
      });
    }

    // Validate subscriptionIds if provided
    let subscriptions = [];
    if (subscriptionIds) {
      const parsedSubscriptionIds = Array.isArray(subscriptionIds)
        ? subscriptionIds
        : JSON.parse(subscriptionIds || '[]');

      if (parsedSubscriptionIds.length > 0) {
        subscriptions = await Subscription.findAll({
          where: { id: { [Op.in]: parsedSubscriptionIds } },
        });
        if (subscriptions.length !== parsedSubscriptionIds.length) {
          return res.status(400).json({
            success: false,
            message: 'One or more subscription IDs are invalid',
          });
        }
      }
    }

    // Update the session
    await session.update({
      title,
      description,
      startTime,
      link,
      thumbnail: thumbnail !== undefined ? thumbnail : session.thumbnail, // Only update if a new file is uploaded
      instructorId,
    });

    // Update subscriptions if provided
    if (subscriptionIds) {
      await session.setSubscriptions(subscriptions);
    }

    // Fetch the updated session with associations
    const updatedSession = await LiveSession.findByPk(id, {
      include: [
        { model: User, as: 'instructor', attributes: ['id', 'username', 'email'] },
        { model: Subscription, as: 'subscriptions', attributes: ['id', 'type'], through: { attributes: [] } },
      ],
    });

    res.json({ success: true, data: updatedSession });
  } catch (error) {
    console.error('Error updating live session:', error);
    res.status(500).json({ success: false, message: 'Failed to update live session' });
  }
};

// Get all live sessions (no changes needed for multer)
exports.getLiveSessions = async (req, res) => {
  try {
    const sessions = await LiveSession.findAll({
      include: [
        { model: User, as: 'instructor', attributes: ['id', 'username', 'email'] },
        { model: Subscription, as: 'subscriptions', attributes: ['id', 'type'], through: { attributes: [] } },
      ],
    });

    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error fetching live sessions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch live sessions' });
  }
};

// Get a single live session by ID (no changes needed for multer)
exports.getLiveSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await LiveSession.findByPk(id, {
      include: [
        { model: User, as: 'instructor', attributes: ['id', 'username', 'email'] },
        { model: Subscription, as: 'subscriptions', attributes: ['id', 'type'], through: { attributes: [] } },
      ],
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Live session not found' });
    }

    res.json({ success: true, data: session });
  } catch (error) {
    console.error('Error fetching live session:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch live session' });
  }
};

// Delete a live session (no changes needed for multer)
exports.deleteLiveSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await LiveSession.findByPk(id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Live session not found' });
    }

    await session.destroy();

    res.json({ success: true, message: 'Live session deleted' });
  } catch (error) {
    console.error('Error deleting live session:', error);
    res.status(500).json({ success: false, message: 'Failed to delete live session' });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Subscription,
        as: 'subscriptions',
        attributes: ['id'],
        through: { attributes: [] },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const subscriptionIds = user.subscriptions.map(sub => sub.id);

    if (subscriptionIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const sessions = await LiveSession.findAll({
      include: [
        {
          model: Subscription,
          as: 'subscriptions',
          where: { id: { [Op.in]: subscriptionIds } },
          attributes: ['id', 'type'],
          through: { attributes: [] },
        },
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'username', 'email'],
        },
      ],
    });

    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user sessions' });
  }
};